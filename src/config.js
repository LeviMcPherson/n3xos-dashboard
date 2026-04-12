const params = new URLSearchParams(window.location.search);

export const API_BASE = "https://bpqhfnhcxlilgcouiesx.supabase.co/functions/v1";
export const TENANT_ID = params.get('tenant') || "a0000000-0000-0000-0000-000000000001";
export const USER_EMAIL = params.get('email') || "growwithlevi@gmail.com";

export const dashboardUrl = `${API_BASE}/n3xos-dashboard-data?tenant_id=${TENANT_ID}&user_email=${USER_EMAIL}`;
export const pageUrl = (page) => `${API_BASE}/n3xos-page-data?page=${page}&tenant_id=${TENANT_ID}&user_email=${USER_EMAIL}`;
