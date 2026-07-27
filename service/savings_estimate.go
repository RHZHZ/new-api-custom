package service

import (
	"errors"
	"math"
	"strings"
	"time"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/model"
	relaycommon "github.com/QuantumNous/new-api/relay/common"
	"github.com/QuantumNous/new-api/setting/billing_setting"
	"github.com/QuantumNous/new-api/setting/ratio_setting"
	"github.com/QuantumNous/new-api/setting/savings_setting"

	"github.com/gin-gonic/gin"
	"github.com/shopspring/decimal"
)

const (
	savingsEstimateSchemaVersion = 1
	savingsTextCalculator        = "text_token_v1"

	SavingsSkipDisabled                 = "disabled"
	SavingsSkipMissingOfficialPrice     = "missing_official_price"
	SavingsSkipUnconfirmedOfficialPrice = "unconfirmed_official_price"
	SavingsSkipMissingUsage             = "missing_usage"
	SavingsSkipUnsupportedBillingMode   = "unsupported_billing_mode"
	SavingsSkipUnknownExtraRatio        = "unknown_extra_ratio"
	SavingsSkipQuotaSaturated           = "quota_saturated"
	SavingsSkipInvalidSnapshot          = "invalid_snapshot"
)

type SavingsEstimate struct {
	SchemaVersion     int    `json:"schema_version"`
	Calculator        string `json:"calculator"`
	OfficialQuota     int    `json:"official_quota"`
	ActualQuota       int    `json:"actual_quota"`
	SavingsQuota      int    `json:"savings_quota"`
	Source            string `json:"source"`
	SourceURL         string `json:"source_url,omitempty"`
	SourceUpdatedAt   int64  `json:"source_updated_at"`
	OfficialConfirmed bool   `json:"official_confirmed"`
	MatchedModel      string `json:"matched_model"`
	PricingMode       string `json:"pricing_mode"`
	Estimated         bool   `json:"estimated"`
}

type SavingsEstimateResult struct {
	Estimate   *SavingsEstimate
	SkipReason string
}

type SavingsSummary struct {
	Enabled               bool    `json:"enabled"`
	SavingsQuota          int     `json:"savings_quota"`
	OfficialQuota         int     `json:"official_quota"`
	ActualQuota           int     `json:"actual_quota"`
	RequestCount          int64   `json:"request_count"`
	EstimatedRequestCount int64   `json:"estimated_request_count"`
	CoverageRatio         float64 `json:"coverage_ratio"`
	Source                string  `json:"source"`
	OfficialConfirmed     bool    `json:"official_confirmed"`
	SourceUpdatedAt       int64   `json:"source_updated_at"`
	OfficialPriceStale    bool    `json:"official_price_stale"`
	IsPartial             bool    `json:"is_partial"`
	WindowDays            int     `json:"window_days"`
}

type savingsLogOther struct {
	SavingsEstimate *SavingsEstimate `json:"savings_estimate"`
}

func AttachTextSavingsEstimate(ctx *gin.Context, relayInfo *relaycommon.RelayInfo, summary textQuotaSummary, tieredBillingApplied bool, other map[string]interface{}) {
	if other == nil {
		return
	}
	result := buildTextSavingsEstimate(ctx, relayInfo, summary, tieredBillingApplied)
	if result.Estimate == nil {
		return
	}
	other["savings_estimate"] = result.Estimate
}

func buildTextSavingsEstimate(ctx *gin.Context, relayInfo *relaycommon.RelayInfo, summary textQuotaSummary, tieredBillingApplied bool) SavingsEstimateResult {
	if !savings_setting.IsEnabled() {
		return SavingsEstimateResult{SkipReason: SavingsSkipDisabled}
	}
	if relayInfo == nil {
		return SavingsEstimateResult{SkipReason: SavingsSkipInvalidSnapshot}
	}
	if summary.TotalTokens <= 0 {
		return SavingsEstimateResult{SkipReason: SavingsSkipMissingUsage}
	}
	if summary.Quota < 0 {
		return SavingsEstimateResult{SkipReason: SavingsSkipInvalidSnapshot}
	}
	if tieredBillingApplied || relayInfo.TieredBillingSnapshot != nil || relayInfo.PriceData.UsePrice {
		return SavingsEstimateResult{SkipReason: SavingsSkipUnsupportedBillingMode}
	}
	if hasSavingsUnsupportedTextExtra(relayInfo, summary) {
		return SavingsEstimateResult{SkipReason: SavingsSkipUnknownExtraRatio}
	}

	setting := savings_setting.GetSetting()
	price, matchedModel, skipReason := matchSavingsOfficialPrice(setting, relayInfo, summary.ModelName)
	if skipReason != "" {
		return SavingsEstimateResult{SkipReason: skipReason}
	}
	officialQuota, skipReason := calculateOfficialTextQuota(summary, price)
	if skipReason != "" {
		return SavingsEstimateResult{SkipReason: skipReason}
	}
	if officialQuota == 0 && summary.TotalTokens > 0 && price.ModelRatio != nil && *price.ModelRatio > 0 {
		officialQuota = 1
	}

	savingsQuota := officialQuota - summary.Quota
	if savingsQuota < 0 {
		savingsQuota = 0
	}
	source := strings.TrimSpace(price.Source)
	if source == "" {
		source = setting.ReferencePriceSource
	}
	if source == "" {
		source = "official_snapshot"
	}

	return SavingsEstimateResult{
		Estimate: &SavingsEstimate{
			SchemaVersion:     savingsEstimateSchemaVersion,
			Calculator:        savingsTextCalculator,
			OfficialQuota:     officialQuota,
			ActualQuota:       summary.Quota,
			SavingsQuota:      savingsQuota,
			Source:            source,
			SourceURL:         price.SourceURL,
			SourceUpdatedAt:   price.SourceUpdatedAt,
			OfficialConfirmed: price.OfficialConfirmed,
			MatchedModel:      matchedModel,
			PricingMode:       "per_token",
			Estimated:         true,
		},
	}
}

func GetUserSavingsSummary(userId int, startTimestamp int64, endTimestamp int64) (*SavingsSummary, error) {
	windowDays := savingsWindowDays(startTimestamp, endTimestamp)
	summary := &SavingsSummary{
		Enabled:    savings_setting.ShowOnDashboard(),
		Source:     "official_snapshot",
		WindowDays: windowDays,
	}
	if !summary.Enabled {
		return summary, nil
	}

	maxRows := savings_setting.MaxSummaryLogRows()
	total, err := model.CountUserSavingsConsumeLogs(userId, startTimestamp, endTimestamp)
	if err != nil {
		return nil, err
	}
	summary.RequestCount = total
	if total == 0 {
		return summary, nil
	}
	if int64(maxRows) > 0 && total > int64(maxRows) {
		summary.IsPartial = true
		return summary, nil
	}

	rows, err := model.GetUserSavingsConsumeLogs(userId, startTimestamp, endTimestamp, maxRows)
	if err != nil {
		return nil, err
	}
	staleBefore := time.Now().Add(-time.Duration(savings_setting.OfficialPriceStaleDays()) * 24 * time.Hour).Unix()
	for _, row := range rows {
		estimate := savingsEstimateFromOther(row.Other)
		if estimate == nil {
			continue
		}
		summary.EstimatedRequestCount++
		summary.OfficialQuota += estimate.OfficialQuota
		summary.ActualQuota += estimate.ActualQuota
		summary.SavingsQuota += estimate.SavingsQuota
		if estimate.Source != "" {
			summary.Source = estimate.Source
		}
		if estimate.OfficialConfirmed {
			summary.OfficialConfirmed = true
		}
		if estimate.SourceUpdatedAt > 0 && (summary.SourceUpdatedAt == 0 || estimate.SourceUpdatedAt < summary.SourceUpdatedAt) {
			summary.SourceUpdatedAt = estimate.SourceUpdatedAt
		}
		if estimate.SourceUpdatedAt > 0 && estimate.SourceUpdatedAt < staleBefore {
			summary.OfficialPriceStale = true
		}
	}
	if summary.RequestCount > 0 {
		summary.CoverageRatio = float64(summary.EstimatedRequestCount) / float64(summary.RequestCount)
	}
	return summary, nil
}

func ValidateSavingsSummaryWindow(startTimestamp int64, endTimestamp int64) error {
	if startTimestamp <= 0 || endTimestamp <= 0 {
		return errors.New("必须传入开始和结束时间")
	}
	if endTimestamp <= startTimestamp {
		return errors.New("时间范围无效")
	}
	if endTimestamp > time.Now().Add(5*time.Minute).Unix() {
		return errors.New("结束时间不能晚于当前时间")
	}
	maxDays := savings_setting.MaxSummaryDays()
	if maxDays > 0 && endTimestamp-startTimestamp > int64(maxDays)*24*3600 {
		return errors.New("时间范围过大，请缩小时间范围")
	}
	return nil
}

func savingsEstimateFromOther(other string) *SavingsEstimate {
	if strings.TrimSpace(other) == "" {
		return nil
	}
	var parsed savingsLogOther
	if err := common.UnmarshalJsonStr(other, &parsed); err != nil {
		return nil
	}
	estimate := parsed.SavingsEstimate
	if estimate == nil || estimate.SchemaVersion != savingsEstimateSchemaVersion {
		return nil
	}
	if estimate.OfficialQuota < 0 || estimate.ActualQuota < 0 || estimate.SavingsQuota < 0 {
		return nil
	}
	return estimate
}

func matchSavingsOfficialPrice(setting savings_setting.Setting, relayInfo *relaycommon.RelayInfo, modelName string) (savings_setting.OfficialPrice, string, string) {
	foundUnconfirmed := false
	for _, candidate := range savingsModelCandidates(relayInfo, modelName) {
		price, ok := setting.OfficialPrices[candidate]
		if !ok {
			continue
		}
		if setting.RequireOfficialConfirmation && !price.OfficialConfirmed {
			foundUnconfirmed = true
			continue
		}
		if price.SourceUpdatedAt <= 0 {
			return price, candidate, SavingsSkipInvalidSnapshot
		}
		return price, candidate, ""
	}
	if foundUnconfirmed {
		return savings_setting.OfficialPrice{}, "", SavingsSkipUnconfirmedOfficialPrice
	}
	return savings_setting.OfficialPrice{}, "", SavingsSkipMissingOfficialPrice
}

func savingsModelCandidates(relayInfo *relaycommon.RelayInfo, modelName string) []string {
	candidates := make([]string, 0, 6)
	add := func(name string) {
		name = strings.TrimSpace(name)
		if name == "" {
			return
		}
		for _, existing := range candidates {
			if existing == name {
				return
			}
		}
		candidates = append(candidates, name)
	}

	add(modelName)
	if relayInfo != nil {
		add(relayInfo.OriginModelName)
		if relayInfo.ChannelMeta != nil {
			add(relayInfo.ChannelMeta.UpstreamModelName)
		}
	}

	baseLen := len(candidates)
	for i := 0; i < baseLen; i++ {
		add(ratio_setting.FormatMatchingModelName(candidates[i]))
	}
	for _, candidate := range candidates {
		if strings.HasSuffix(candidate, ratio_setting.CompactModelSuffix) {
			add(ratio_setting.CompactWildcardModelKey)
			break
		}
	}
	return candidates
}

func calculateOfficialTextQuota(summary textQuotaSummary, price savings_setting.OfficialPrice) (int, string) {
	mode := strings.TrimSpace(price.BillingMode)
	if mode == "" {
		mode = billing_setting.BillingModeRatio
	}
	if price.QuotaType != 0 || (mode != billing_setting.BillingModeRatio && mode != "per_token") {
		return 0, SavingsSkipUnsupportedBillingMode
	}
	if price.ModelRatio == nil || price.CompletionRatio == nil ||
		!validSavingsRatio(*price.ModelRatio, false) ||
		!validSavingsRatio(*price.CompletionRatio, true) {
		return 0, SavingsSkipInvalidSnapshot
	}
	if summary.AudioTokens > 0 {
		return 0, SavingsSkipUnsupportedBillingMode
	}

	baseTokens := decimal.NewFromInt(int64(summary.PromptTokens))
	cacheQuota := decimal.Zero
	if summary.CacheTokens > 0 {
		cacheRatio := 1.0
		if price.CacheRatio != nil {
			if !validSavingsRatio(*price.CacheRatio, true) {
				return 0, SavingsSkipInvalidSnapshot
			}
			cacheRatio = *price.CacheRatio
		}
		if !summary.IsClaudeUsageSemantic && !summary.LegacyClaudeDerivedUsage {
			baseTokens = baseTokens.Sub(decimal.NewFromInt(int64(summary.CacheTokens)))
		}
		cacheQuota = decimal.NewFromInt(int64(summary.CacheTokens)).Mul(decimal.NewFromFloat(cacheRatio))
	}

	cacheCreateQuota, skipReason := calculateOfficialCacheCreateQuota(summary, price)
	if skipReason != "" {
		return 0, skipReason
	}

	imageQuota := decimal.Zero
	if summary.ImageTokens > 0 {
		imageRatio := 1.0
		if price.ImageRatio != nil {
			if !validSavingsRatio(*price.ImageRatio, true) {
				return 0, SavingsSkipInvalidSnapshot
			}
			imageRatio = *price.ImageRatio
		}
		baseTokens = baseTokens.Sub(decimal.NewFromInt(int64(summary.ImageTokens)))
		imageQuota = decimal.NewFromInt(int64(summary.ImageTokens)).Mul(decimal.NewFromFloat(imageRatio))
	}

	if baseTokens.IsNegative() {
		baseTokens = decimal.Zero
	}

	promptQuota := baseTokens.Add(cacheQuota).Add(cacheCreateQuota).Add(imageQuota)
	completionQuota := decimal.NewFromInt(int64(summary.CompletionTokens)).Mul(decimal.NewFromFloat(*price.CompletionRatio))
	quotaDecimal := promptQuota.Add(completionQuota).Mul(decimal.NewFromFloat(*price.ModelRatio))
	if quotaDecimal.IsNegative() {
		return 0, SavingsSkipInvalidSnapshot
	}
	quota, clamp := common.QuotaFromDecimalChecked(quotaDecimal)
	if clamp != nil {
		return 0, SavingsSkipQuotaSaturated
	}
	return quota, ""
}

func calculateOfficialCacheCreateQuota(summary textQuotaSummary, price savings_setting.OfficialPrice) (decimal.Decimal, string) {
	cacheWriteTokens := summary.CacheCreationTokens
	hasSplitCacheCreationTokens := summary.CacheCreationTokens5m > 0 || summary.CacheCreationTokens1h > 0
	if cacheWriteTokens <= 0 && !hasSplitCacheCreationTokens {
		return decimal.Zero, ""
	}
	if !summary.IsClaudeUsageSemantic && !summary.LegacyClaudeDerivedUsage {
		if price.CreateCacheRatio == nil || !validSavingsRatio(*price.CreateCacheRatio, true) {
			return decimal.Zero, SavingsSkipInvalidSnapshot
		}
		return decimal.NewFromInt(int64(cacheWriteTokens)).Mul(decimal.NewFromFloat(*price.CreateCacheRatio)), ""
	}

	total := decimal.Zero
	remaining := cacheWriteTokens - summary.CacheCreationTokens5m - summary.CacheCreationTokens1h
	if remaining < 0 {
		remaining = 0
	}
	if remaining > 0 {
		if price.CreateCacheRatio == nil || !validSavingsRatio(*price.CreateCacheRatio, true) {
			return decimal.Zero, SavingsSkipInvalidSnapshot
		}
		total = total.Add(decimal.NewFromInt(int64(remaining)).Mul(decimal.NewFromFloat(*price.CreateCacheRatio)))
	}
	if summary.CacheCreationTokens5m > 0 {
		if price.CacheCreation5mRatio == nil || !validSavingsRatio(*price.CacheCreation5mRatio, true) {
			return decimal.Zero, SavingsSkipInvalidSnapshot
		}
		total = total.Add(decimal.NewFromInt(int64(summary.CacheCreationTokens5m)).Mul(decimal.NewFromFloat(*price.CacheCreation5mRatio)))
	}
	if summary.CacheCreationTokens1h > 0 {
		if price.CacheCreation1hRatio == nil || !validSavingsRatio(*price.CacheCreation1hRatio, true) {
			return decimal.Zero, SavingsSkipInvalidSnapshot
		}
		total = total.Add(decimal.NewFromInt(int64(summary.CacheCreationTokens1h)).Mul(decimal.NewFromFloat(*price.CacheCreation1hRatio)))
	}
	return total, ""
}

func hasSavingsUnsupportedTextExtra(relayInfo *relaycommon.RelayInfo, summary textQuotaSummary) bool {
	if relayInfo != nil && len(relayInfo.PriceData.OtherRatios()) > 0 {
		return true
	}
	return summary.WebSearchCallCount > 0 ||
		summary.ClaudeWebSearchCallCount > 0 ||
		summary.FileSearchCallCount > 0 ||
		summary.AudioInputPrice > 0 ||
		summary.ImageGenerationCallPrice > 0
}

func validSavingsRatio(value float64, allowZero bool) bool {
	if math.IsNaN(value) || math.IsInf(value, 0) {
		return false
	}
	if allowZero {
		return value >= 0
	}
	return value > 0
}

func savingsWindowDays(startTimestamp int64, endTimestamp int64) int {
	if endTimestamp <= startTimestamp {
		return 0
	}
	return int((endTimestamp - startTimestamp + 24*3600 - 1) / (24 * 3600))
}
