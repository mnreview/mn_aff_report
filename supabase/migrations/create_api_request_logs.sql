-- Create table for tracking API requests
CREATE TABLE IF NOT EXISTS api_request_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    app_id TEXT NOT NULL,
    endpoint TEXT NOT NULL,
    request_type TEXT NOT NULL, -- 'conversion_report', 'generate_link', etc.
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_address TEXT,
    user_agent TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for fast queries
CREATE INDEX IF NOT EXISTS idx_api_requests_app_id_timestamp
    ON api_request_logs(app_id, timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_api_requests_user_id_timestamp
    ON api_request_logs(user_id, timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_api_requests_timestamp
    ON api_request_logs(timestamp DESC);

-- Enable Row Level Security
ALTER TABLE api_request_logs ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can view their own logs
CREATE POLICY "Users can view own API logs"
    ON api_request_logs
    FOR SELECT
    USING (auth.uid() = user_id OR user_id IS NULL);

-- Create policy: Service role can insert logs
CREATE POLICY "Service role can insert logs"
    ON api_request_logs
    FOR INSERT
    WITH CHECK (true);

-- Create policy: Service role can view all logs
CREATE POLICY "Service role can view all logs"
    ON api_request_logs
    FOR SELECT
    USING (true);

-- Create function to get rate limit status for an app_id
CREATE OR REPLACE FUNCTION get_rate_limit_status(p_app_id TEXT)
RETURNS JSON AS $$
DECLARE
    v_count INTEGER;
    v_oldest_timestamp TIMESTAMPTZ;
    v_result JSON;
BEGIN
    -- Count requests in the last hour
    SELECT COUNT(*), MIN(timestamp)
    INTO v_count, v_oldest_timestamp
    FROM api_request_logs
    WHERE app_id = p_app_id
        AND timestamp > NOW() - INTERVAL '1 hour';

    -- Build result
    v_result := json_build_object(
        'app_id', p_app_id,
        'used', COALESCE(v_count, 0),
        'remaining', GREATEST(0, 2000 - COALESCE(v_count, 0)),
        'total', 2000,
        'percentage', ROUND((COALESCE(v_count, 0)::NUMERIC / 2000) * 100, 2),
        'oldest_timestamp', v_oldest_timestamp,
        'reset_time', (
            CASE
                WHEN v_oldest_timestamp IS NULL THEN NOW()
                ELSE v_oldest_timestamp + INTERVAL '1 hour'
            END
        ),
        'checked_at', NOW()
    );

    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to clean old logs (older than 7 days)
CREATE OR REPLACE FUNCTION cleanup_old_api_logs()
RETURNS INTEGER AS $$
DECLARE
    v_deleted INTEGER;
BEGIN
    DELETE FROM api_request_logs
    WHERE timestamp < NOW() - INTERVAL '7 days';

    GET DIAGNOSTICS v_deleted = ROW_COUNT;
    RETURN v_deleted;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments for documentation
COMMENT ON TABLE api_request_logs IS 'Tracks all API requests to Shopee API for rate limit monitoring';
COMMENT ON FUNCTION get_rate_limit_status IS 'Returns current rate limit status for a given app_id';
COMMENT ON FUNCTION cleanup_old_api_logs IS 'Deletes API logs older than 7 days. Returns number of deleted rows.';
