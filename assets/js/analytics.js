const analyticsConfig = {
  baseUrl: 'https://cloud.umami.is',
  shareToken: 'YOUR_UMAMI_READ_ONLY_SHARE_TOKEN'
};

const trackingScript = document.querySelector('script[data-website-id]');
const websiteId = trackingScript?.dataset.websiteId;
const statsPanel = document.getElementById('visitorStats');
const activeVisitorsLabel = document.getElementById('activeVisitors');
const totalViewsLabel = document.getElementById('totalViews');
const statsStatus = document.getElementById('visitorStatsStatus');
const placeholderPattern = /^YOUR_UMAMI_/;

function isAnalyticsConfigured() {
  return Boolean(
    analyticsConfig.baseUrl &&
    websiteId &&
    analyticsConfig.shareToken &&
    !placeholderPattern.test(websiteId) &&
    !placeholderPattern.test(analyticsConfig.shareToken)
  );
}

async function fetchAnalytics(path, startAt, endAt) {
  const url = new URL(`${analyticsConfig.baseUrl.replace(/\/+$/, '')}/api/websites/${encodeURIComponent(websiteId)}/${path}`);

  if (startAt !== undefined) {
    url.searchParams.set('startAt', String(startAt));
    url.searchParams.set('endAt', String(endAt));
  }

  const response = await fetch(url, {
    headers: {
      'x-umami-share-token': analyticsConfig.shareToken,
      'x-umami-share-context': '1'
    }
  });

  if (!response.ok) {
    throw new Error(`Analytics request failed (${response.status})`);
  }

  return response.json();
}

async function updateVisitorStats() {
  const endAt = Date.now();
  const lifetimeStart = Date.UTC(2000, 0, 1);

  try {
    const [active, totals] = await Promise.all([
      fetchAnalytics('active'),
      fetchAnalytics('stats', lifetimeStart, endAt)
    ]);

    if (
      !Number.isFinite(active.visitors) ||
      !Number.isFinite(totals.pageviews) ||
      active.visitors < 0 ||
      totals.pageviews < 0
    ) {
      throw new Error('Analytics returned invalid visitor totals');
    }

    activeVisitorsLabel.textContent = active.visitors.toLocaleString();
    totalViewsLabel.textContent = totals.pageviews.toLocaleString();
    statsStatus.textContent = 'Live visitor count · Views since analytics setup';
  } catch (error) {
    console.error('Unable to load visitor statistics:', error);
    statsStatus.textContent = 'Visitor statistics are temporarily unavailable.';
  }
}

if (statsPanel && activeVisitorsLabel && totalViewsLabel && statsStatus && isAnalyticsConfigured()) {
  statsPanel.hidden = false;
  updateVisitorStats();
  window.setInterval(updateVisitorStats, 60_000);
}
