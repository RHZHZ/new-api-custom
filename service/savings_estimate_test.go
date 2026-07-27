package service

import (
	"testing"
	"time"

	"github.com/QuantumNous/new-api/common"
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

func configureSavingsSetting(t *testing.T, prices map[string]savings_setting.OfficialPrice) {
	t.Helper()
	require.NoError(t, savings_setting.UpdateSettingByJSONString(""))
	t.Cleanup(func() { require.NoError(t, savings_setting.UpdateSettingByJSONString("")) })

	value := savings_setting.Setting{
		Enabled:                     true,
		ShowOnDashboard:             true,
		ShowOnUsageLogs:             true,
		ReferencePriceSource:        "official_snapshot",
		RequireOfficialConfirmation: true,
		OfficialPriceStaleDays:      90,
		MaxSummaryDays:              31,
		MaxSummaryLogRows:           50000,
		OfficialPrices:              prices,
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
