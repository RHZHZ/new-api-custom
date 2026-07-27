package service

import (
	"testing"
	"time"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/model"
	"github.com/QuantumNous/new-api/pkg/billingexpr"
	relaycommon "github.com/QuantumNous/new-api/relay/common"
	"github.com/QuantumNous/new-api/setting/savings_setting"
	"github.com/QuantumNous/new-api/types"

	"github.com/stretchr/testify/require"
)

func TestBuildTextSavingsEstimateSkipsWhenDisabled(t *testing.T) {
	require.NoError(t, savings_setting.UpdateSettingByJSONString(""))
	t.Cleanup(func() { require.NoError(t, savings_setting.UpdateSettingByJSONString("")) })

	result := buildTextSavingsEstimate(nil, savingsRelayInfo("gpt-4o-mini"), savingsSummary(100), false)

	require.Nil(t, result.Estimate)
	require.Equal(t, SavingsSkipDisabled, result.SkipReason)
}

func TestBuildTextSavingsEstimateUsesConfirmedOfficialPrice(t *testing.T) {
	configureSavingsSetting(t, map[string]savings_setting.OfficialPrice{
		"gpt-4o-mini": {
			ModelRatio:        float64Ptr(2),
			CompletionRatio:   float64Ptr(3),
			Source:            "OpenAI",
			SourceURL:         "https://openai.com/api/pricing",
			SourceUpdatedAt:   1_700_000_000,
			OfficialConfirmed: true,
		},
	})

	result := buildTextSavingsEstimate(nil, savingsRelayInfo("gpt-4o-mini"), savingsSummary(100), false)

	require.Empty(t, result.SkipReason)
	require.NotNil(t, result.Estimate)
	require.Equal(t, 260, result.Estimate.OfficialQuota)
	require.Equal(t, 100, result.Estimate.ActualQuota)
	require.Equal(t, 160, result.Estimate.SavingsQuota)
	require.Equal(t, "OpenAI", result.Estimate.Source)
	require.Equal(t, "https://openai.com/api/pricing", result.Estimate.SourceURL)
	require.Equal(t, "gpt-4o-mini", result.Estimate.MatchedModel)
	require.True(t, result.Estimate.OfficialConfirmed)
	require.Equal(t, savingsCalculationSnapshot, result.Estimate.CalculationMode)
	require.NotEmpty(t, result.Estimate.PriceFingerprint)
}

func TestBuildTextSavingsEstimateSkipsUnconfirmedOfficialPrice(t *testing.T) {
	configureSavingsSetting(t, map[string]savings_setting.OfficialPrice{
		"gpt-4o-mini": {
			ModelRatio:      float64Ptr(1),
			CompletionRatio: float64Ptr(1),
			SourceUpdatedAt: 1_700_000_000,
		},
	})

	result := buildTextSavingsEstimate(nil, savingsRelayInfo("gpt-4o-mini"), savingsSummary(100), false)

	require.Nil(t, result.Estimate)
	require.Equal(t, SavingsSkipUnconfirmedOfficialPrice, result.SkipReason)
}

func TestBuildTextSavingsEstimateSkipsUnsupportedBillingModes(t *testing.T) {
	configureSavingsSetting(t, map[string]savings_setting.OfficialPrice{
		"gpt-4o-mini": {
			ModelRatio:        float64Ptr(1),
			CompletionRatio:   float64Ptr(1),
			SourceUpdatedAt:   1_700_000_000,
			OfficialConfirmed: true,
		},
	})

	t.Run("fixed price billing", func(t *testing.T) {
		relayInfo := savingsRelayInfo("gpt-4o-mini")
		relayInfo.PriceData.UsePrice = true

		result := buildTextSavingsEstimate(nil, relayInfo, savingsSummary(100), false)

		require.Nil(t, result.Estimate)
		require.Equal(t, SavingsSkipUnsupportedBillingMode, result.SkipReason)
	})

	t.Run("tiered billing", func(t *testing.T) {
		relayInfo := savingsRelayInfo("gpt-4o-mini")
		relayInfo.TieredBillingSnapshot = &billingexpr.BillingSnapshot{BillingMode: "tiered_expr"}

		result := buildTextSavingsEstimate(nil, relayInfo, savingsSummary(100), false)

		require.Nil(t, result.Estimate)
		require.Equal(t, SavingsSkipUnsupportedBillingMode, result.SkipReason)
	})

	t.Run("other ratios", func(t *testing.T) {
		relayInfo := savingsRelayInfo("gpt-4o-mini")
		relayInfo.PriceData.AddOtherRatio("n", 2)

		result := buildTextSavingsEstimate(nil, relayInfo, savingsSummary(100), false)

		require.Nil(t, result.Estimate)
		require.Equal(t, SavingsSkipUnknownExtraRatio, result.SkipReason)
	})
}

func TestBuildTextSavingsEstimateNeverReturnsNegativeSavings(t *testing.T) {
	configureSavingsSetting(t, map[string]savings_setting.OfficialPrice{
		"gpt-4o-mini": {
			ModelRatio:        float64Ptr(1),
			CompletionRatio:   float64Ptr(1),
			SourceUpdatedAt:   1_700_000_000,
			OfficialConfirmed: true,
		},
	})

	result := buildTextSavingsEstimate(nil, savingsRelayInfo("gpt-4o-mini"), savingsSummary(500), false)

	require.NotNil(t, result.Estimate)
	require.Equal(t, 110, result.Estimate.OfficialQuota)
	require.Equal(t, 500, result.Estimate.ActualQuota)
	require.Equal(t, 0, result.Estimate.SavingsQuota)
}

func TestSavingsEstimateFromOtherRejectsInvalidPayloads(t *testing.T) {
	require.Nil(t, savingsEstimateFromOther(""))
	require.Nil(t, savingsEstimateFromOther("{bad json"))
	require.Nil(t, savingsEstimateFromOther(common.MapToJsonStr(map[string]any{
		"savings_estimate": SavingsEstimate{SchemaVersion: 999},
	})))
	require.Nil(t, savingsEstimateFromOther(common.MapToJsonStr(map[string]any{
		"savings_estimate": SavingsEstimate{
			SchemaVersion: savingsEstimateSchemaVersion,
			OfficialQuota: -1,
		},
	})))
	require.Nil(t, savingsEstimateFromOther(common.MapToJsonStr(map[string]any{
		"savings_estimate": SavingsEstimate{
			SchemaVersion: savingsEstimateSchemaVersion,
			OfficialQuota: 200,
			ActualQuota:   80,
			SavingsQuota:  121,
		},
	})))

	other := common.MapToJsonStr(map[string]any{
		"savings_estimate": SavingsEstimate{
			SchemaVersion: savingsEstimateSchemaVersion,
			OfficialQuota: 200,
			ActualQuota:   80,
			SavingsQuota:  120,
		},
	})

	estimate := savingsEstimateFromOther(other)
	require.NotNil(t, estimate)
	require.Equal(t, 120, estimate.SavingsQuota)
}

func TestMatchSavingsOfficialPriceUsesLocalPricingFallback(t *testing.T) {
	setting := savings_setting.Setting{
		LocalPricingOfficialConfirmed: true,
		RequireOfficialConfirmation:   true,
		OfficialPrices:                map[string]savings_setting.OfficialPrice{},
	}
	localPrices := map[string]savings_setting.OfficialPrice{
		"gpt-4o-mini": {
			ModelRatio:        float64Ptr(1),
			CompletionRatio:   float64Ptr(2),
			Source:            savingsSourceLocalPricing,
			PriceSnapshotAt:   1_700_000_000,
			OfficialConfirmed: true,
		},
	}

	price, matchedModel, skipReason := matchSavingsOfficialPriceCandidates(
		setting,
		[]string{"gpt-4o-mini"},
		localPrices,
		1_700_000_000,
	)

	require.Empty(t, skipReason)
	require.Equal(t, "gpt-4o-mini", matchedModel)
	require.Equal(t, savingsSourceLocalPricing, price.Source)
	require.NotEmpty(t, price.PriceFingerprint)
}

func TestSavingsPriceFingerprintTracksPricingFields(t *testing.T) {
	first := savings_setting.OfficialPrice{
		ModelRatio:      float64Ptr(1),
		CompletionRatio: float64Ptr(2),
	}
	second := first
	require.True(t, finalizeSavingsOfficialPrice(&first, "gpt-4o-mini"))
	require.True(t, finalizeSavingsOfficialPrice(&second, "gpt-4o-mini"))
	require.Equal(t, first.PriceFingerprint, second.PriceFingerprint)

	second.CompletionRatio = float64Ptr(3)
	require.True(t, finalizeSavingsOfficialPrice(&second, "gpt-4o-mini"))
	require.NotEqual(t, first.PriceFingerprint, second.PriceFingerprint)
}

func TestRebuildHistoricalSavingsEstimateRequiresActualQuotaMatch(t *testing.T) {
	setting := savings_setting.Setting{
		RequireOfficialConfirmation: true,
		OfficialPrices: map[string]savings_setting.OfficialPrice{
			"gpt-4o-mini": {
				ModelRatio:        float64Ptr(2),
				CompletionRatio:   float64Ptr(3),
				Source:            "OpenAI",
				OfficialConfirmed: true,
			},
		},
	}
	row := model.SavingsLogRow{
		ModelName:        "gpt-4o-mini",
		PromptTokens:     100,
		CompletionTokens: 10,
		Quota:            55,
		Other: common.MapToJsonStr(map[string]any{
			"model_ratio":      0.5,
			"group_ratio":      1.0,
			"completion_ratio": 1.0,
			"model_price":      0.0,
			"cache_tokens":     0,
			"cache_ratio":      0.5,
		}),
	}

	result := rebuildHistoricalSavingsEstimate(setting, nil, row, 1_700_000_000)

	require.Empty(t, result.SkipReason)
	require.NotNil(t, result.Estimate)
	require.Equal(t, 260, result.Estimate.OfficialQuota)
	require.Equal(t, 55, result.Estimate.ActualQuota)
	require.Equal(t, 205, result.Estimate.SavingsQuota)
	require.Equal(t, savingsCalculationHistorical, result.Estimate.CalculationMode)

	row.Quota = 56
	result = rebuildHistoricalSavingsEstimate(setting, nil, row, 1_700_000_000)
	require.Nil(t, result.Estimate)
	require.Equal(t, SavingsSkipLegacyActualQuotaMismatch, result.SkipReason)
}

func TestRebuildHistoricalSavingsEstimateRejectsMissingBaseFields(t *testing.T) {
	result := rebuildHistoricalSavingsEstimate(
		savings_setting.Setting{},
		nil,
		model.SavingsLogRow{
			ModelName:        "gpt-4o-mini",
			PromptTokens:     100,
			CompletionTokens: 10,
			Quota:            55,
			Other:            `{}`,
		},
		1_700_000_000,
	)

	require.Nil(t, result.Estimate)
	require.Equal(t, SavingsSkipLegacyMissingBaseFields, result.SkipReason)
}

func TestNormalizeSavingsSummaryWindowClampsSmallClockSkew(t *testing.T) {
	now := time.Now().Unix()
	effectiveEnd, err := NormalizeSavingsSummaryWindow(now-3600, now+60)

	require.NoError(t, err)
	require.InDelta(t, time.Now().Unix(), effectiveEnd, 1)

	_, err = NormalizeSavingsSummaryWindow(now-3600, now+5*60+10)
	require.EqualError(t, err, "结束时间不能晚于当前时间")
}

func configureSavingsSetting(t *testing.T, prices map[string]savings_setting.OfficialPrice) {
	t.Helper()
	require.NoError(t, savings_setting.UpdateSettingByJSONString(""))
	t.Cleanup(func() { require.NoError(t, savings_setting.UpdateSettingByJSONString("")) })

	value := savings_setting.Setting{
		Enabled:                       true,
		ShowOnDashboard:               true,
		ShowOnUsageLogs:               true,
		LocalPricingOfficialConfirmed: false,
		RebuildLegacyLogs:             true,
		RequireOfficialConfirmation:   true,
		OfficialPriceStaleDays:        90,
		MaxSummaryDays:                31,
		MaxSummaryLogRows:             50000,
		OfficialPrices:                prices,
	}
	jsonBytes, err := common.Marshal(value)
	require.NoError(t, err)
	require.NoError(t, savings_setting.UpdateSettingByJSONString(string(jsonBytes)))
}

func savingsRelayInfo(model string) *relaycommon.RelayInfo {
	return &relaycommon.RelayInfo{
		OriginModelName: model,
		PriceData: types.PriceData{
			ModelRatio:      0.5,
			CompletionRatio: 1,
			GroupRatioInfo: types.GroupRatioInfo{
				GroupRatio: 1,
			},
		},
		StartTime: time.Now(),
	}
}

func savingsSummary(actualQuota int) textQuotaSummary {
	return textQuotaSummary{
		PromptTokens:     100,
		CompletionTokens: 10,
		TotalTokens:      110,
		Quota:            actualQuota,
		ModelName:        "gpt-4o-mini",
	}
}

func float64Ptr(value float64) *float64 {
	return &value
}
