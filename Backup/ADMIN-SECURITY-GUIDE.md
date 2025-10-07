# STP Solar Admin Portal Security Guide

## Overview
The admin portal has been secured with multiple layers of authentication and security measures to protect pricing configuration access.

## Authentication Methods

### 1. Client-Side Authentication (✅ Implemented)
- **File**: `admin-pricing.html`
- **Method**: JavaScript-based login form
- **Credentials**: 
  - Username: `stpadmin`
  - Password: `Solar2024!`
- **Session**: Uses `sessionStorage` for persistence
- **Features**:
  - Login form with error handling
  - Logout button in header
  - Session persistence across page refreshes

### 2. Server-Side Authentication (✅ Implemented)
- **File**: `admin-auth.php`
- **Method**: PHP session-based authentication
- **Features**:
  - Server-side credential validation
  - Session timeout (30 minutes)
  - Secure session management
  - JSON API for login/logout/status checks

### 3. Dedicated Login Page (✅ Implemented)
- **File**: `admin-login.html`
- **Method**: Standalone login page with server integration
- **Features**:
  - Professional login interface
  - AJAX authentication
  - Automatic redirect on success
  - Rate limiting protection

## Security Features

### Rate Limiting
- **File**: `admin-security.php`
- **Protection**: 5 attempts per 5-minute window per IP
- **Storage**: JSON file-based tracking
- **Response**: HTTP 429 (Too Many Requests) when exceeded

### IP Whitelisting (Optional)
- **File**: `admin-security.php`
- **Status**: Commented out by default
- **Usage**: Uncomment and add IP addresses to restrict access
- **Support**: Individual IPs and CIDR ranges

### Activity Logging
- **File**: `admin_activity.log`
- **Tracks**: Login attempts, actions, IP addresses, user agents
- **Retention**: 30 days (auto-cleanup)
- **Format**: Timestamped entries with full details

### Security Headers
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

## Default Credentials

### Current Credentials
- **Username**: `stpadmin`
- **Password**: `Solar2024!`

### Changing Credentials

#### For Client-Side Authentication:
1. Edit `admin-pricing.html`
2. Update the `ADMIN_CREDENTIALS` object:
```javascript
const ADMIN_CREDENTIALS = {
    username: 'your_new_username',
    password: 'your_new_password'
};
```

#### For Server-Side Authentication:
1. Edit `admin-auth.php`
2. Update the `$ADMIN_CREDENTIALS` array:
```php
$ADMIN_CREDENTIALS = [
    'username' => 'your_new_username',
    'password' => 'your_new_password'
];
```

## Access Methods

### Method 1: Direct Access
1. Navigate to `admin-pricing.html`
2. Enter credentials on login form
3. Access admin panel

### Method 2: Server-Side Protected
1. Navigate to `admin-login.html`
2. Enter credentials
3. Automatic redirect to admin panel

### Method 3: PHP-Protected
1. Include `admin-auth.php` in admin pages
2. Server automatically redirects to login if not authenticated
3. Session-based access control

## Security Best Practices

### For Development:
1. Use strong, unique passwords
2. Change default credentials immediately
3. Enable IP whitelisting for production
4. Monitor activity logs regularly
5. Use HTTPS in production

### For Production:
1. **Change default credentials**
2. **Enable IP whitelisting**
3. **Use HTTPS only**
4. **Regular security updates**
5. **Monitor access logs**
6. **Backup configuration files**

## File Structure

```
stp-solar/
├── admin-pricing.html          # Main admin panel (client-side auth)
├── admin-login.html            # Dedicated login page
├── admin-auth.php              # Server-side authentication
├── admin-security.php          # Security configuration
├── admin_activity.log          # Activity log (auto-generated)
├── admin_rate_limit.json       # Rate limiting data (auto-generated)
└── ADMIN-SECURITY-GUIDE.md     # This guide
```

## Troubleshooting

### Login Issues:
1. Check credentials are correct
2. Clear browser cache and cookies
3. Check browser console for errors
4. Verify server-side files are accessible

### Rate Limiting:
1. Wait 5 minutes for reset
2. Clear `admin_rate_limit.json` file
3. Check IP address in logs

### Session Issues:
1. Clear browser session storage
2. Check server session configuration
3. Verify PHP session settings

## Security Recommendations

### Immediate Actions:
1. **Change default password** to something strong
2. **Enable IP whitelisting** for production
3. **Use HTTPS** for all admin access
4. **Regular backup** of configuration files

### Ongoing Maintenance:
1. **Monitor activity logs** weekly
2. **Update credentials** quarterly
3. **Review access patterns** monthly
4. **Test security measures** regularly

## Emergency Access

If locked out:
1. Clear browser data completely
2. Delete `admin_rate_limit.json` file
3. Check server logs for issues
4. Contact system administrator

## Production Deployment

### Before Going Live:
1. Change all default credentials
2. Enable IP whitelisting
3. Set up HTTPS
4. Configure proper file permissions
5. Test all security features
6. Set up monitoring

### File Permissions:
```bash
chmod 600 admin-auth.php
chmod 600 admin-security.php
chmod 644 admin-pricing.html
chmod 644 admin-login.html
```

## Support

For security issues or questions:
1. Check this guide first
2. Review activity logs
3. Test in development environment
4. Contact system administrator

---

**⚠️ Important**: Always change default credentials before production use!
