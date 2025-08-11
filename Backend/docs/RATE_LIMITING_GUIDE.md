# Rate Limiting Guide for 1000+ Users

## 📊 Current Rate Limits (Updated for Scale)

### **General API Requests**
- **Per IP**: 1,000 requests / 15 minutes
- **Per User**: 500 requests / 15 minutes (when authenticated)
- **Reasoning**: Accommodates multiple users behind corporate NATs

### **Authentication Endpoints**
- **Per IP**: 20 login attempts / 15 minutes
- **Per User**: 10 login attempts / 15 minutes
- **Reasoning**: Prevents brute force while allowing legitimate retries

### **Password Changes**
- **Per IP**: 10 attempts / 1 hour
- **Per User**: 5 attempts / 1 hour
- **Reasoning**: Security-sensitive operation with reasonable limits

### **File Uploads**
- **Per IP**: 50 uploads / 1 minute
- **Per User**: 20 uploads / 1 minute
- **Reasoning**: Prevents abuse while allowing batch operations

## 🏢 Enterprise Scaling Strategies

### **1. User-Based Rate Limiting**
```javascript
// Instead of just IP-based limiting
keyGenerator: (req) => {
  if (req.user?.id) {
    return `user:${req.user.id}`;
  }
  return req.ip;
}
```

### **2. Role-Based Limits**
```javascript
max: (req) => {
  if (req.user?.role === 'admin') return 1000;
  if (req.user?.role === 'employee') return 500;
  return 100; // Unauthenticated
}
```

### **3. Distributed Rate Limiting with Redis**
```bash
# Add to .env for distributed systems
REDIS_URL=redis://localhost:6379
```

## 📈 Recommended Limits by Organization Size

### **Small Teams (< 50 users)**
```env
RATE_LIMIT_MAX_REQUESTS=500
AUTH_RATE_LIMIT_MAX=15
```

### **Medium Organizations (50-500 users)**
```env
RATE_LIMIT_MAX_REQUESTS=1000
AUTH_RATE_LIMIT_MAX=20
```

### **Large Enterprises (500-2000 users)**
```env
RATE_LIMIT_MAX_REQUESTS=2000
AUTH_RATE_LIMIT_MAX=30
```

### **Very Large Organizations (2000+ users)**
```env
RATE_LIMIT_MAX_REQUESTS=5000
AUTH_RATE_LIMIT_MAX=50
# Consider implementing Redis for distributed limiting
```

## 🚨 Corporate Network Considerations

### **Problem: Shared IP Addresses**
- Multiple users behind corporate NAT
- VPN connections sharing IP ranges
- Cloud environments with shared IPs

### **Solutions:**
1. **User-based limiting** (primary)
2. **Higher IP limits** for corporate ranges
3. **Whitelist trusted IP ranges**
4. **Hybrid approach**: IP + User combination

## 🔧 Advanced Configuration

### **Environment Variables**
```env
# General Rate Limiting
RATE_LIMIT_WINDOW_MS=900000          # 15 minutes
RATE_LIMIT_MAX_REQUESTS=2000         # Per IP
RATE_LIMIT_MAX_PER_USER=500          # Per authenticated user

# Authentication Rate Limiting
AUTH_RATE_LIMIT_WINDOW_MS=900000     # 15 minutes
AUTH_RATE_LIMIT_MAX=30               # Per IP
AUTH_RATE_LIMIT_MAX_PER_USER=10      # Per user

# Password Change Rate Limiting
PASSWORD_CHANGE_WINDOW_MS=3600000    # 1 hour
PASSWORD_CHANGE_LIMIT_MAX=10         # Per IP
PASSWORD_CHANGE_LIMIT_MAX_PER_USER=5 # Per user

# Upload Rate Limiting
UPLOAD_RATE_LIMIT_WINDOW_MS=60000    # 1 minute
UPLOAD_RATE_LIMIT_MAX=100            # Per IP
UPLOAD_RATE_LIMIT_MAX_PER_USER=30    # Per user

# Burst Protection
BURST_PROTECTION_WINDOW_MS=60000     # 1 minute
BURST_PROTECTION_MAX=100             # Very short-term limit

# Redis Configuration (for distributed systems)
REDIS_URL=redis://localhost:6379
```

## 📊 Monitoring and Alerts

### **Key Metrics to Track**
- Rate limit violations per hour
- Top IPs hitting limits
- User accounts hitting limits
- Geographic distribution of requests

### **Alert Thresholds**
- > 100 rate limit violations/hour
- Single IP > 50% of total violations
- Authentication failures > 20/minute

## 🛡️ Security Best Practices

### **1. Layered Rate Limiting**
- Burst protection (1 minute window)
- Short-term limits (15 minutes)
- Long-term limits (1 hour)

### **2. Adaptive Limits**
- Increase limits for verified users
- Decrease limits for suspicious activity
- Temporary bans for repeated violations

### **3. Graceful Degradation**
- Queue non-critical requests
- Prioritize authenticated users
- Implement retry-after headers

## 🚀 Performance Optimization

### **1. Efficient Storage**
- Use Redis for distributed systems
- Memory-based for single instances
- Clean up expired entries

### **2. Minimal Overhead**
- Skip rate limiting for static assets
- Cache rate limit decisions
- Use efficient key generation

## 📞 Emergency Procedures

### **If Legitimate Users Are Blocked**
1. Check current limits in `.env`
2. Temporarily increase limits
3. Whitelist specific IP ranges
4. Monitor for abuse

### **If Under Attack**
1. Reduce limits immediately
2. Enable burst protection
3. Block suspicious IP ranges
4. Monitor logs for patterns

## 🔄 Migration from Current Setup

1. **Update `.env` file** with new limits
2. **Restart application** to apply changes
3. **Monitor logs** for rate limit violations
4. **Adjust limits** based on actual usage
5. **Consider Redis** for distributed deployments
