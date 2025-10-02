# EmailJS Setup Instructions for Solix International

## 🎯 Quick Setup (15 minutes)

EmailJS will send all quote requests and contact messages directly to **Info@solix-Int.com**

### Step 1: Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address

### Step 2: Set Up Email Service
1. In EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose **Gmail** (recommended) or your email provider
4. Connect your email account or SMTP settings
5. Test the connection
6. **Note down your SERVICE_ID** (e.g., "service_xyz123")

### Step 3: Create Email Templates

#### 3A: Quote Request Template
1. Go to "Email Templates" → "Create New Template"
2. **Template Name:** "Solix International Quote Request"
3. **Template ID:** Note this down (e.g., "template_quote123")
4. **Subject:** `New Quote Request from {{company_name}} - {{quantity}} tons`
5. **Content:** Copy this template:

```
QUOTE REQUEST RECEIVED
========================

COMPANY INFORMATION:
- Company: {{company_name}}
- Contact Person: {{from_name}}
- Email: {{from_email}}
- Phone: {{phone}}

PROJECT DETAILS:
- Product Type: {{product_type}}
- Cement Grade: {{cement_grade}}
- Packaging Type: {{packaging_type}}
- Quantity: {{quantity}} tons
- Delivery Frequency: {{delivery_frequency}}
- Contract Duration: {{monthly_duration}}
- Total Project Volume: {{total_quantity}} tons
- Destination: {{destination}}
- Timeline: {{timeline}}
- Delivery Terms: {{delivery_terms}}

ADDITIONAL NOTES:
{{notes}}

Submitted: {{timestamp}}

---
This is an automated message from the Solix International website.
All Solix products are SGS certified and inspected before departure.
Please respond to {{from_email}} with your quotation.
```

#### 3B: Contact Form Template  
1. Create another template: "Solix International Contact Message"
2. **Template ID:** Note this down (e.g., "template_contact123")
3. **Subject:** `Website Contact: {{subject}}`
4. **Content:**

```
CONTACT MESSAGE RECEIVED
========================

FROM: {{from_name}} <{{from_email}}>
SUBJECT: {{subject}}

MESSAGE:
{{message}}

Submitted: {{timestamp}}

---
This is an automated message from the Solix International website.
Please respond to {{from_email}}.
```

### Step 4: Update Website Configuration
1. Open the file `js/main.js`
2. Find these lines and replace with your actual IDs:

```javascript
// Replace YOUR_PUBLIC_KEY with your EmailJS public key
publicKey: "YOUR_PUBLIC_KEY",

// Replace YOUR_SERVICE_ID with your service ID
emailjs.send('YOUR_SERVICE_ID', 'YOUR_QUOTE_TEMPLATE_ID', templateParams)

// Replace YOUR_QUOTE_TEMPLATE_ID with your quote template ID
'YOUR_QUOTE_TEMPLATE_ID'

// Replace YOUR_CONTACT_TEMPLATE_ID with your contact template ID  
'YOUR_CONTACT_TEMPLATE_ID'
```

**Example after replacement:**
```javascript
publicKey: "user_1A2B3C4D5E6F7G8H",
emailjs.send('service_gmail123', 'template_quote456', templateParams)
```

### Step 5: Test the Setup
1. Save all files
2. Open your website
3. Fill out the quote form with test data
4. Check Info@solix-Int.com for the email
5. Test the contact form as well

## 📊 What You'll Receive

### Quote Request Emails:
- **Subject:** "New Quote Request from [Company] - [Quantity] tons"  
- **From:** EmailJS service (replies go to customer)
- **To:** Info@solix-Int.com
- **Content:** All form details professionally formatted

### Contact Inquiry Emails:
- **Subject:** "Website Contact: [Subject]"
- **From:** EmailJS service (replies go to customer)  
- **To:** Info@solix-Int.com
- **Content:** Customer name, email, and message

## 💰 EmailJS Pricing
- **Free:** 200 emails/month
- **Personal:** $20/month for 1000 emails
- **Professional:** $35/month for 5000 emails

## 🔧 Configuration Files to Update

### File: `js/main.js`
**Lines to replace:**
- Line ~15: `publicKey: "YOUR_PUBLIC_KEY"`
- Line ~65: `'YOUR_SERVICE_ID'`
- Line ~65: `'YOUR_QUOTE_TEMPLATE_ID'`  
- Line ~120: `'YOUR_CONTACT_TEMPLATE_ID'`

### Find Your EmailJS Keys:
1. **Public Key:** EmailJS Dashboard → Account → General
2. **Service ID:** Email Services → Your service → Service ID
3. **Template IDs:** Email Templates → Your templates → Template ID

## 🚨 Important Security Notes
- EmailJS public key is safe to use in frontend code
- No sensitive credentials are exposed
- Rate limiting prevents spam abuse
- All emails go through EmailJS servers

## 📧 Test Email Example

When someone requests a quote for 50,000 tons of cement, you'll receive:

```
Subject: New Quote Request from ABC Construction - 50,000 tons

QUOTE REQUEST RECEIVED
========================

COMPANY INFORMATION:
- Company: ABC Construction  
- Contact Person: John Smith
- Email: john@abcconstruction.com
- Phone: +1-555-0123

PROJECT DETAILS:
- Product Type: cement
- Cement Grade: CE 42.5 R (Rapid early strength)
- Packaging Type: 1.5 Ton Polyester Lined Jumbo Bags
- Quantity: 50,000 tons
- Delivery Frequency: monthly
- Contract Duration: 12
- Total Project Volume: 600,000 tons
- Destination: Caribbean
- Timeline: Standard (1-3 months)
- Delivery Terms: CIF

ADDITIONAL NOTES:
Need certification documents for government project.

Submitted: 12/27/2024, 2:30:45 PM
```

## 🎯 Ready to Go Live!

Once configured, your website will immediately start sending professional quote requests to Info@solix-Int.com. No server required, no hosting changes needed!

**Need help?** Contact EmailJS support or check their documentation at [docs.emailjs.com](https://www.emailjs.com/docs/)