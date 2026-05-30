import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import Nav from '../components/Nav'

// ── Accordion section component ───────────────────────────────────────────────

interface SectionProps {
  title: string
  tags?: string          // e.g. "👤 Worker · 📱 Mobile"
  defaultOpen?: boolean
  children: React.ReactNode
}

function Section({ title, tags, defaultOpen = false, children }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="bg-cream rounded-xl border border-surface overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between p-4 text-left gap-3"
        aria-expanded={open}
      >
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-ink">{title}</p>
          {tags && <p className="text-xs text-ink/40 mt-0.5">{tags}</p>}
        </div>
        {open
          ? <ChevronDown size={16} className="text-gold flex-shrink-0" />
          : <ChevronRight size={16} className="text-ink/30 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-4 pb-5 space-y-3 border-t border-surface/60 pt-3 text-sm text-ink leading-relaxed">
          {children}
        </div>
      )}
    </div>
  )
}

// ── Small sub-components for consistent styling ────────────────────────────

function H({ children }: { children: React.ReactNode }) {
  return <p className="font-semibold text-ink mt-2 mb-0.5">{children}</p>
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 items-start">
      <span className="w-6 h-6 bg-espresso text-on-dark rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
        {n}
      </span>
      <span className="flex-1">{children}</span>
    </div>
  )
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gold/10 border border-gold/30 rounded-lg px-3 py-2 text-xs text-ink/70">
      💡 {children}
    </div>
  )
}

function Warn({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-700">
      ⚠️ {children}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2 py-1.5 border-b border-surface/60 last:border-0">
      <span className="text-ink/50 text-xs">{label}</span>
      <span className="text-ink text-xs font-medium text-right">{value}</span>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function GuidePage() {
  return (
    <div className="min-h-dvh bg-linen">
      <Nav title="User Guide" />

      <main className="max-w-2xl mx-auto px-4 py-5 space-y-3">

        {/* Header */}
        <div className="mb-2">
          <h2 className="text-lg font-bold text-ink">Diet Swad — Team Guide</h2>
          <p className="text-xs text-ink/50 mt-0.5">
            Internal app guide · Radiant Twins Enterprise · v2.0
          </p>
        </div>

        {/* 1 */}
        <Section title="1. What this app is & who uses it" defaultOpen>
          <p>
            This app — <strong>Diet Swad Internal</strong> — is the private team tool for running
            day-to-day operations of the Diet Swad snack brand. It lives at{' '}
            <strong>internal.dietswad.in</strong> and is only accessible to approved team members.
          </p>
          <p>
            Everything you need is here: creating orders, tracking deliveries, handling COD &amp;
            returns, sending invoices, sharing marketing links, and managing the URL shortener.
          </p>
          <H>Who uses it</H>
          <div className="space-y-1">
            <Row label="👤 Worker" value="Creates orders, marks deliveries, COD, returns, shares links" />
            <Row label="🛠 Owner / Admin" value="All of the above + settings, Cloudflare, GitHub, Azure" />
          </div>
          <H>Where it runs</H>
          <div className="space-y-1">
            <Row label="📱 Mobile (primary)" value="All daily tasks — install to home screen for best experience" />
            <Row label="💻 Desktop" value="Bulk CSV entry, Cloudflare / GitHub / Azure admin tasks" />
          </div>
          <Tip>
            Bookmark or install this app to your phone's home screen (see section 2). It works like
            a native app — no app store needed.
          </Tip>
        </Section>

        {/* 2 */}
        <Section title="2. Getting in — login, install & notifications" tags="📱 Mobile · 👤 Everyone">
          <H>Step 1 — Open the app</H>
          <p>
            Go to <strong>internal.dietswad.in</strong> in Chrome (Android) or Safari (iPhone).
          </p>

          <H>Step 2 — Cloudflare email verification (first time on each device)</H>
          <div className="space-y-1.5">
            <Step n={1}>You'll see a "Cloudflare Access" screen before the app loads.</Step>
            <Step n={2}>Enter your email address (must be on the approved team list).</Step>
            <Step n={3}>Check your inbox for a one-time PIN (6 digits). It arrives in under 1 minute.</Step>
            <Step n={4}>Enter the PIN. You're through — this stays valid for 1 week on this device.</Step>
          </div>
          <Tip>If you don't get the email, check your spam folder. The sender is Cloudflare.</Tip>
          <Warn>Only approved email addresses can get in. Contact the owner to be added to the team list.</Warn>

          <H>Step 3 — App password</H>
          <p>
            After the Cloudflare check you'll see the Diet Swad login screen. Enter the shared team
            password. This logs you in for <strong>24 hours</strong> — after that you'll be asked to
            log in again.
          </p>
          <Warn>
            The password is shared by the whole team. Never share it outside the team. If you think
            it's been leaked, tell the owner immediately so it can be rotated.
          </Warn>

          <H>Step 4 — Install to home screen (recommended)</H>
          <p>Installing makes the app feel native — full screen, no browser bar, works offline.</p>
          <div className="space-y-1.5">
            <Step n={1}><strong>Android Chrome:</strong> Tap the three-dot menu → "Add to Home screen" → Install.</Step>
            <Step n={2}><strong>iPhone Safari:</strong> Tap the Share button (box with arrow) → "Add to Home Screen" → Add.</Step>
            <Step n={3}>A "Diet Swad" icon now appears on your home screen. Use that to open the app.</Step>
          </div>
          <Tip>
            If a banner says "Add Diet Swad to your home screen", tap it — it's a shortcut to the
            same thing.
          </Tip>

          <H>Step 5 — Turn on notifications (recommended)</H>
          <p>
            The app can send you a push notification when a new order arrives or needs attention.
          </p>
          <div className="space-y-1.5">
            <Step n={1}>When the app asks for notification permission, tap <strong>Allow</strong>.</Step>
            <Step n={2}>Or go to Settings → §5 Preferences → toggle "Push notifications" ON.</Step>
          </div>
        </Section>

        {/* 3 */}
        <Section title="3. Getting around the app" tags="📱 Mobile · 👤 Everyone">
          <H>Bottom tab bar</H>
          <p>
            At the bottom of every screen there are 5 tabs. Tap any of them to jump directly to that
            section — no need to go back to Home first.
          </p>
          <div className="space-y-1">
            <Row label="🏠 Home" value="The main dashboard — all 8 sections in a grid" />
            <Row label="📋 Orders" value="View and manage all orders" />
            <Row label="🔗 Share" value="Share UTM links with customers" />
            <Row label="↗ Shortener" value="Create and manage short links" />
            <Row label="⚙ Settings" value="App settings, preferences, this guide" />
          </div>

          <H>Header back button</H>
          <p>
            The <strong>← arrow</strong> in the top-left corner of the header takes you one step
            back — just like your phone's back button. It disappears on the Home screen (nothing to
            go back to).
          </p>

          <H>Home grid</H>
          <p>
            The Home screen shows 8 tiles — tap any to go directly to that section. The sections not
            in the bottom bar (Dashboards, Manual Order, Bulk Entry, Products) are always reachable
            from Home.
          </p>
          <Tip>
            For daily work you'll mostly use the bottom tab bar. The Home grid is useful when you
            need the less-frequent sections like Bulk Entry or Dashboards.
          </Tip>
        </Section>

        {/* 4 */}
        <Section title="4. Daily — taking a new order (Manual Order)" tags="📱 Mobile · 👤 Worker">
          <p>
            Use <strong>Manual Order</strong> (Home → Manual Order) to create a single customer
            order. This is for orders taken over WhatsApp, phone, or in person.
          </p>
          <H>Step by step</H>
          <div className="space-y-1.5">
            <Step n={1}>
              <strong>Customer details</strong> — Enter full name, 10-digit mobile number, email
              (optional, needed to send an invoice), delivery address, and 6-digit PIN code.
            </Step>
            <Step n={2}>
              <strong>Products</strong> — Tap "Select product" and pick from the catalog. Enter
              quantity. Tap "+ Add product" if the order has more than one item. Use the trash icon
              to remove a line.
            </Step>
            <Step n={3}>
              <strong>Payment method</strong> — Choose UPI, Cash, COD, Partial COD, Payment Link,
              or Bank Transfer. Use "Partial COD" when the customer paid part online and will pay
              the rest in cash on delivery.
            </Step>
            <Step n={4}>
              <strong>Payment status</strong> — "Paid" if already received, "Not Paid" if pending,
              "COD" if they'll pay on delivery in full, "Cancelled" to cancel the order.
            </Step>
            <Step n={5}>
              <strong>Custom / Gift orders</strong> — If you select "Custom Order" or "Gift
              Hampers" as the product, a "Custom product name" field appears. Fill it in — it's
              required for these two product types.
            </Step>
            <Step n={6}>
              Add any notes (special instructions, reference numbers, etc.) — optional.
            </Step>
            <Step n={7}>
              Tap <strong>"Create Order"</strong>. You'll see a confirmation screen with the new
              Order ID.
            </Step>
          </div>
          <Tip>
            For COD orders, set Payment Status = COD. When you deliver and collect cash, use the
            "Mark Delivered" button on the Order Detail screen — it records COD collection
            automatically.
          </Tip>
          <Warn>
            Double-check the phone number and address before creating. Fixing them after requires
            editing the order — or going into Notion directly.
          </Warn>
        </Section>

        {/* 5 */}
        <Section title="5. Daily — finding & viewing orders" tags="📱 Mobile · 👤 Worker">
          <H>Orders list</H>
          <p>
            Tap <strong>Orders</strong> in the bottom bar. You'll see all orders, newest first.
          </p>
          <p><strong>Today's summary bar</strong> at the top shows at a glance:</p>
          <div className="space-y-1">
            <Row label="Orders today" value="Count of orders created today" />
            <Row label="Paid revenue" value="Total ₹ from Paid orders today" />
            <Row label="Pending" value="Orders not yet marked Delivered" />
            <Row label="COD to collect" value="Cash still outstanding from COD orders" />
          </div>

          <H>Search &amp; filters</H>
          <div className="space-y-1.5">
            <Step n={1}>Type a customer name, phone number, or Order ID in the search box.</Step>
            <Step n={2}>Use the filter dropdowns to narrow by Status (New, Preparing, Out for Delivery, Delivered, Cancelled, RTO) or Payment (Paid, COD, Not Paid).</Step>
            <Step n={3}>Use the date pickers to see orders from a specific period.</Step>
          </div>

          <H>Order detail</H>
          <p>Tap any order card to open its detail screen. You'll see:</p>
          <div className="space-y-1">
            <Row label="Header card" value="Order ID, total amount, status badges" />
            <Row label="Customer" value="Name, phone (tap to call), email" />
            <Row label="Delivery" value="Address, PIN, expected date" />
            <Row label="Products" value="Items ordered, quantities" />
            <Row label="Payment" value="Method, reference, invoice number" />
            <Row label="Notes" value="Any special instructions" />
          </div>

          <H>Editing an order</H>
          <div className="space-y-1.5">
            <Step n={1}>Tap the <strong>Edit</strong> button (pencil icon).</Step>
            <Step n={2}>Change Status, Payment Status, Payment Method, Address, PIN, Delivery Date, Notes, or Payment Reference.</Step>
            <Step n={3}>Tap <strong>Save Changes</strong>. Only changed fields are updated in Notion.</Step>
            <Step n={4}>Tap <strong>Cancel</strong> to discard without saving.</Step>
          </div>
          <Tip>Changes sync to Notion in real time — the team sees updates immediately.</Tip>
        </Section>

        {/* 6 */}
        <Section title="6. Daily — deliveries, COD & returns (RTO)" tags="📱 Mobile · 👤 Worker">
          <H>Marking an order as delivered</H>
          <p>
            When an order's status is <strong>"Out for Delivery"</strong>, two action buttons appear
            at the top of the Order Detail screen.
          </p>
          <div className="space-y-1.5">
            <Step n={1}>Open the order via Orders list → tap the order card.</Step>
            <Step n={2}>
              Tap the green <strong>"Mark Delivered"</strong> button. If it's a COD order, the
              button says "Mark Delivered · COD Collected" — tap it only after you have physically
              received the cash.
            </Step>
            <Step n={3}>Status updates to "Delivered" and the payment record is updated automatically.</Step>
          </div>

          <H>Partial COD (split payment)</H>
          <p>
            If a customer paid part online and the rest is COD, the Order Detail screen shows two
            separate lines: "Paid online: ₹XXX" and "To collect: ₹XXX" in amber. Mark Delivered
            once you collect the remaining cash.
          </p>

          <H>Logging a Return to Origin (RTO)</H>
          <p>
            RTO means the shipment came back — delivery failed. Tap the red{' '}
            <strong>"Log RTO"</strong> button (appears alongside Mark Delivered).
          </p>
          <div className="space-y-1.5">
            <Step n={1}><strong>Outcome</strong> — e.g. "Returned to Origin", "Lost in Transit".</Step>
            <Step n={2}><strong>Reason</strong> — e.g. "Wrong address", "Customer refused", "Not reachable".</Step>
            <Step n={3}><strong>Return shipping cost</strong> — the ₹ amount you absorbed (affects loss calculations).</Step>
            <Step n={4}>Optional: return AWB tracking ID, return date, notes.</Step>
            <Step n={5}>Tap <strong>Submit RTO</strong>. Status changes to "RTO" and a summary card appears on the order.</Step>
          </div>
          <Warn>
            Always log RTOs promptly — the Dashboards use RTO data for loss calculations and
            reconciliation.
          </Warn>
        </Section>

        {/* 7 */}
        <Section title="7. Daily — sending invoices" tags="📱 Mobile · 👤 Worker">
          <p>
            You can email a PDF invoice to the customer directly from the app. The invoice is
            generated automatically from the order details.
          </p>
          <H>How to send</H>
          <div className="space-y-1.5">
            <Step n={1}>Open the Order Detail screen.</Step>
            <Step n={2}>
              Tap the gold <strong>"Send Invoice"</strong> button. It's only active (not greyed out)
              when the order has a valid email address.
            </Step>
            <Step n={3}>
              The system sends the invoice and shows you a success toast with the invoice number
              (e.g. "Invoice INV-00042 sent").
            </Step>
          </div>
          <Tip>
            If the button is greyed out, the customer's email is missing or invalid. Go to Edit mode
            and the email field is not available there — you'd need to update the email directly in
            Notion for now.
          </Tip>
          <Warn>
            Invoices are sent to the customer's Gmail. Make sure the email is correct before
            sending — there's no "unsend". Each send creates a new invoice number in sequence.
          </Warn>
        </Section>

        {/* 8 */}
        <Section title="8. Sharing & marketing links" tags="📱 Mobile · 👤 Worker">
          <H>Share Link — UTM-tagged links for customers</H>
          <p>
            Use <strong>Share</strong> (bottom bar) to copy ready-made links to send to customers via
            WhatsApp, Instagram DM, or any channel. Each link has a UTM tag so you know where the
            traffic came from.
          </p>
          <div className="space-y-1.5">
            <Step n={1}>Tap <strong>Share</strong> in the bottom bar.</Step>
            <Step n={2}>Pick the channel you're sending from (e.g. "WhatsApp Broadcast", "Instagram Story", "Personal WhatsApp").</Step>
            <Step n={3}>
              You'll see 4–5 cards, one per link type: Website, Order Form, Google Review, UPI ID,
              UPI Phone Number.
            </Step>
            <Step n={4}>
              Tap the <strong>copy icon</strong> on any card — the link copies to your clipboard.
              Paste it in WhatsApp / Instagram / wherever.
            </Step>
            <Step n={5}>
              Tap <strong>"Share bundle"</strong> to open your phone's share sheet with all links
              together (great for WhatsApp messages).
            </Step>
          </div>
          <Tip>
            Always use these links instead of typing URLs manually — the UTM tags let us track which
            channel is actually driving orders.
          </Tip>

          <H>URL Shortener — branded short links</H>
          <p>
            Use <strong>Shortener</strong> (bottom bar) to create short{' '}
            <strong>dietswad.in/code</strong> links for Instagram bios, WhatsApp status, QR codes,
            etc. Each click is counted.
          </p>
          <div className="space-y-1.5">
            <Step n={1}>Tap <strong>Shortener</strong> → tap the <strong>+</strong> (New) button.</Step>
            <Step n={2}>
              Pick a <strong>channel</strong> (e.g. "Instagram Bio") — it pre-fills the UTM tags.
            </Step>
            <Step n={3}>Enter the long URL you want to shorten.</Step>
            <Step n={4}>Optional: enter a custom code (e.g. <code>summer</code> → dietswad.in/summer). Leave blank for an auto-generated code.</Step>
            <Step n={5}>
              Tap <strong>Create Short Link</strong>. You'll see a QR code and the short URL — copy
              it or download the QR PNG.
            </Step>
          </div>
          <H>Viewing click stats</H>
          <p>
            Tap any short link in the Shortener list to see its stats: total clicks, days active,
            average clicks/day, last clicked date, and the UTM breakdown. You can also download the
            QR code image from here.
          </p>
          <H>Channel tiles</H>
          <p>
            Tap <strong>"Channels"</strong> in the Shortener list header to see all 14 predefined
            channels grouped by type (Broadcast, Share, Order). Tap any channel to pre-fill a new
            short link with the right UTM parameters.
          </p>
        </Section>

        {/* 9 */}
        <Section title="9. Bulk entry (distributor / multiple orders)" tags="📱📱💻 · 👤 Worker">
          <p>
            <strong>Bulk Entry</strong> (Home → Bulk Entry) has two tabs: Single Customer and CSV
            Batch.
          </p>
          <H>Single Customer tab</H>
          <p>Use this for distributor orders (multiple SKUs, one delivery address).</p>
          <div className="space-y-1.5">
            <Step n={1}>Fill in customer details (same fields as Manual Order but with a Distributor Name field).</Step>
            <Step n={2}>Add products and quantities. The system auto-fills each product's price from the catalog.</Step>
            <Step n={3}>Set payment method and status.</Step>
            <Step n={4}>If you tick "Auto-send invoice", an invoice is emailed immediately on creation (requires a valid email).</Step>
            <Step n={5}>Tap <strong>"Create Distributor Order"</strong>.</Step>
          </div>

          <H>CSV Batch tab (💻 Desktop recommended)</H>
          <p>Use this to create many orders at once from a spreadsheet export.</p>
          <p>The CSV format is: <code className="bg-surface px-1 rounded text-xs">name, phone, product, qty, address, pincode, amount</code></p>
          <div className="space-y-1.5">
            <Step n={1}>Prepare your CSV file with one order per row (no header row needed).</Step>
            <Step n={2}>Tap <strong>"Upload CSV"</strong> or paste the rows directly in the text area.</Step>
            <Step n={3}>Tap <strong>"Parse &amp; Preview"</strong> — you'll see a table of the parsed orders with any row errors highlighted.</Step>
            <Step n={4}>Fix any errors in the CSV and re-parse.</Step>
            <Step n={5}>Tap <strong>"Submit All"</strong>. Orders are created one by one (with a short delay to avoid Notion rate limits). A results table shows each row's success or failure.</Step>
          </div>
          <Tip>
            The app processes ~3 orders per second. A batch of 30 orders takes about 10 seconds.
            Keep the screen open until the results table appears.
          </Tip>
        </Section>

        {/* 10 */}
        <Section title="10. Weekly tasks" tags="📱 Mobile · 👤 Worker + Owner">
          <div className="space-y-2">
            <div className="bg-linen rounded-lg p-3 space-y-1.5">
              <p className="font-semibold text-xs text-ink/50 uppercase tracking-wide">Every week</p>
              <p>✅ Review all <strong>Pending</strong> and <strong>Out for Delivery</strong> orders — follow up on any older than 3 days.</p>
              <p>✅ Check for unrecorded COD — look for Delivered orders still marked "Not Paid".</p>
              <p>✅ Glance at <strong>Shortener</strong> click stats — which links are getting traction?</p>
              <p>✅ Check <strong>Dashboards</strong> for orders + revenue trend (note: full data charts come in Phase 4).</p>
              <p>✅ <strong>Owner:</strong> Spot-check Notion database for any manual edits or anomalies.</p>
            </div>
          </div>
        </Section>

        {/* 11 */}
        <Section title="11. Monthly tasks" tags="💻 Desktop (some) · 🛠 Owner">
          <div className="space-y-2">
            <div className="bg-linen rounded-lg p-3 space-y-1.5">
              <p className="font-semibold text-xs text-ink/50 uppercase tracking-wide">Every month</p>
              <p>✅ Reconcile all <strong>COD orders</strong> — total collected vs. total due.</p>
              <p>✅ Reconcile all <strong>RTO orders</strong> — count + total shipping loss absorbed.</p>
              <p>✅ Review Notion for any orders in "New" status older than 30 days — close or cancel them.</p>
              <p>✅ Check the <strong>Shortener</strong> for stale or unused short links — delete if not needed.</p>
              <p>✅ Consider rotating the app password (especially if any team changes happened).</p>
              <p>✅ Review the team access list in Cloudflare (add/remove emails as needed).</p>
            </div>
          </div>
        </Section>

        {/* 12 */}
        <Section title="12. Products — catalog, prices & management" tags="📱 Mobile · 🛠 Owner (for editing)">
          <p>
            Tap <strong>Products</strong> (Home → Products) to see the live product catalog fetched
            from the backend. Products are sorted by display order.
          </p>
          <p>
            This catalog is what the app uses to auto-fill prices when creating orders. Each product
            shows its name, current price, whether it's Active (shows in the order picker), and
            whether it's listed on the website.
          </p>
          <Tip>
            Products marked <strong>Legacy</strong> are old SKUs no longer sold — they appear in
            the list for historical orders but are inactive in the order picker.
          </Tip>

          <H>Editing a product 🛠</H>
          <div className="space-y-1.5">
            <Step n={1}>Tap the <strong>pencil (edit) icon</strong> on any product row/card.</Step>
            <Step n={2}>A drawer slides up. You can change:
              <ul className="mt-1 ml-4 space-y-0.5 text-xs text-ink/60 list-disc">
                <li><strong>Price (₹)</strong> — the selling price used in order calculations</li>
                <li><strong>Active</strong> — if OFF, the product won't appear in the Manual Order / Bulk Entry pickers</li>
                <li><strong>Show on website</strong> — controls whether the product is listed on the customer-facing website</li>
              </ul>
            </Step>
            <Step n={3}>Tap <strong>Save</strong>. Changes sync to the backend immediately.</Step>
          </div>

          <H>Adding a new product 🛠</H>
          <div className="space-y-1.5">
            <Step n={1}>Tap <strong>"New product"</strong> (top-right button).</Step>
            <Step n={2}>Enter product name, price (₹), display order (the sort position in the list), Active toggle, and Show on website toggle.</Step>
            <Step n={3}>Tap <strong>"Add Product"</strong>.</Step>
          </div>
          <Warn>
            Editing prices takes effect immediately for all new orders — but existing order records
            keep the price they were created with. Always double-check before changing a price.
          </Warn>
        </Section>

        {/* 13 */}
        <Section title="13. Settings — complete reference" tags="⚙ · 🛠 Owner (mostly)">
          <p>Go to <strong>Settings</strong> (bottom bar) to configure the app.</p>
          <H>§1 Default Links</H>
          <p>The base URLs used when building share links — website URL and order form URL. Change these only if the website address changes.</p>
          <H>§2 Review &amp; Payment</H>
          <p>Google Review link (shared with customers), UPI ID (e.g. dietswad@okaxis), and UPI phone number. These appear in the Share Link cards.</p>
          <H>§3 Channel Overrides</H>
          <p>
            Override the default website or order form URL for a specific channel. For example, you
            might want the Instagram Bio share link to go to a different landing page than the
            WhatsApp Broadcast link. Leave blank to use the §1 defaults.
          </p>
          <H>§4 URL Shortener API</H>
          <p>
            The base URL of the backend API. Pre-configured — don't change unless the backend moves
            (owner task only).
          </p>
          <H>§5 Preferences</H>
          <p>Toggle push notifications on/off. Link to the UTM Channel Summary reference table.</p>
          <H>§6 About</H>
          <p>App version, company name, contact number, backend server. Read-only.</p>
          <H>Saving settings</H>
          <p>
            Tap <strong>Save Settings</strong> — settings are stored locally on your device. Each
            device can have its own settings. Tap <strong>Reset</strong> to restore all defaults.
          </p>
          <Warn>Settings are per-device. If you log in on a new phone, you'll need to set them up again.</Warn>
        </Section>

        {/* 14 */}
        <Section title="14. How the system works — behind the scenes" tags="🛠 Owner · 💻 Desktop">
          <H>The big picture</H>
          <p>
            Diet Swad's tech stack has 4 main pieces, all connected:
          </p>
          <div className="space-y-2 mt-1">
            <div className="bg-linen rounded-lg p-3">
              <p className="font-semibold text-xs">🌐 Customer Website — dietswad.in</p>
              <p className="text-xs text-ink/60 mt-0.5">Static pages on GitHub Pages. Cloudflare sits in front for speed + caching. This is what customers see.</p>
            </div>
            <div className="bg-linen rounded-lg p-3">
              <p className="font-semibold text-xs">📱 Internal PWA — internal.dietswad.in</p>
              <p className="text-xs text-ink/60 mt-0.5">This app. Also on GitHub Pages but locked behind Cloudflare Access. The app shell is public code but has zero real data in it.</p>
            </div>
            <div className="bg-linen rounded-lg p-3">
              <p className="font-semibold text-xs">⚙️ Backend — Azure Functions (dietswad-api)</p>
              <p className="text-xs text-ink/60 mt-0.5">Python serverless functions running in Azure, Central India. Handles logins, order creation, invoice generation, payments, push notifications. Runs only when needed (serverless = pay per call, not per hour).</p>
            </div>
            <div className="bg-linen rounded-lg p-3">
              <p className="font-semibold text-xs">🗃 Data — Notion database</p>
              <p className="text-xs text-ink/60 mt-0.5">All orders live in one Notion database ("DIET SWAD ORDERS"). This is the source of truth. The team can open Notion directly as a fallback if the app is down.</p>
            </div>
            <div className="bg-linen rounded-lg p-3">
              <p className="font-semibold text-xs">🔗 URL Shortener — Azure Function</p>
              <p className="text-xs text-ink/60 mt-0.5">A separate Azure Function handles dietswad.in/{'{code}'} redirects. Each click is counted and stored in Azure Table Storage.</p>
            </div>
            <div className="bg-linen rounded-lg p-3">
              <p className="font-semibold text-xs">📄 Invoice Worker — GitHub Actions</p>
              <p className="text-xs text-ink/60 mt-0.5">When you tap "Send Invoice", the Azure API triggers a GitHub Actions job in the <strong>dietswad-invoice-worker</strong> repo. That job fetches the order from Notion, renders a PDF invoice (WeasyPrint), and emails it to the customer. It also assigns the invoice number and stamps it back in Notion.</p>
            </div>
          </div>

          <H>GitHub repositories &amp; visibility</H>
          <div className="space-y-1">
            <Row label="DietSwad/DietSwad (website)" value="🌍 PUBLIC — customer-facing" />
            <Row label="DietSwad/dietswad-internal-pwa" value="🌍 PUBLIC — shell only, no data" />
            <Row label="DietSwad/dietswad-api" value="🔒 PRIVATE — main backend (JWT, orders, shortener)" />
            <Row label="DietSwad/dietswad-invoice-worker" value="🔒 PRIVATE — PDF invoice renderer + emailer" />
            <Row label="DietSwad/internal-android-app" value="🔒 Frozen — URL shortener screens only" />
            <Row label="DietSwad_URL_shortener_Azure_Function" value="🔒 Internal — dietswad.in/{code} redirects" />
            <Row label="Whatsapp_Webhook_Azure_Function" value="🔒 Decommissioned — no live traffic" />
          </div>
          <Warn>
            The PWA repo is public but that's safe — it contains only the React app shell. All real
            data (orders, revenue) lives in Notion + Azure, never in the repo.
          </Warn>

          <H>Why these choices were made</H>
          <div className="space-y-1.5">
            <p><strong>Notion as the database:</strong> Free, zero server maintenance, the team can edit orders directly in Notion if something breaks in the app. Simple but powerful enough for this scale.</p>
            <p><strong>Azure Functions (serverless):</strong> We only pay when the API is actually called, not 24/7. At current order volumes this is essentially free.</p>
            <p><strong>PWA instead of a native Android app:</strong> One codebase works on every phone + laptop. No app store approvals. Faster to update — push a commit, it's live in minutes.</p>
            <p><strong>Cloudflare Access for security:</strong> At 3–5 team members, a full user account system adds complexity for no benefit. Email OTP via Cloudflare is enterprise-grade security with zero code to maintain.</p>
            <p><strong>Dashboards on private Azure Blob, not GitHub Pages:</strong> The PWA repo is public. Putting dashboard data (which contains real revenue + customer PII) on public Pages would be a data leak. Dashboards stay private.</p>
          </div>
        </Section>

        {/* 15 */}
        <Section title="15. Cloudflare cache purge — when changes don't show up" tags="🛠 Owner · 💻 Desktop">
          <p>
            Cloudflare caches the website and PWA for speed. Sometimes after a deployment, visitors
            still see the old version because Cloudflare is serving the cached copy. Purging the
            cache fixes this instantly.
          </p>
          <H>When to purge</H>
          <div className="space-y-0.5 text-xs text-ink/70">
            <p>• A website update (new page, price change, product update) isn't showing for customers.</p>
            <p>• The PWA shows an old version after a GitHub deploy.</p>
            <p>• A URL redirect is behaving unexpectedly.</p>
          </div>
          <H>How to purge (exact steps)</H>
          <div className="space-y-1.5">
            <Step n={1}>Go to <strong>dash.cloudflare.com</strong> and log in.</Step>
            <Step n={2}>Select the <strong>dietswad.in</strong> zone (domain).</Step>
            <Step n={3}>In the left sidebar, click <strong>Caching</strong> → <strong>Configuration</strong>.</Step>
            <Step n={4}>
              Click the <strong>Purge Cache</strong> button.
              <ul className="mt-1 ml-4 space-y-1 text-xs text-ink/60 list-disc">
                <li><strong>Custom Purge</strong> — paste specific URLs to purge just those pages (faster, targeted).</li>
                <li><strong>Purge Everything</strong> — clears the entire cache for the domain. Use this when multiple pages changed.</li>
              </ul>
            </Step>
            <Step n={5}>Click <strong>Purge</strong> to confirm. Changes are visible to everyone within 30 seconds.</Step>
          </div>
          <Tip>
            GitHub Actions automatically purges the cache on every deploy — so for PWA updates you
            usually don't need to do this manually. It's mainly needed for website changes.
          </Tip>
        </Section>

        {/* 16 */}
        <Section title="16. Access control — adding or removing team members" tags="🛠 Owner · 💻 Desktop">
          <H>How team access works</H>
          <p>
            Only email addresses in the "Diet Swad Team" group on Cloudflare Access can reach the
            app. Sessions last 1 week — after that the team member re-verifies with an email OTP.
          </p>
          <H>Adding a new team member</H>
          <div className="space-y-1.5">
            <Step n={1}>Go to <strong>one.dash.cloudflare.com</strong> → Zero Trust.</Step>
            <Step n={2}>Navigate to <strong>Access → Groups</strong> → click "Diet Swad Team".</Step>
            <Step n={3}>Under "Include", add the new email address. Save.</Step>
            <Step n={4}>Share the app URL (internal.dietswad.in) and the shared password with them securely.</Step>
          </div>

          <H>Removing a team member</H>
          <div className="space-y-1.5">
            <Step n={1}>Follow steps 1–2 above.</Step>
            <Step n={2}>Remove their email from the "Include" list. Save.</Step>
            <Step n={3}>Their existing session is revoked within minutes — they cannot access the app anymore.</Step>
          </div>
          <Tip>After removing someone, also rotate the shared app password so they can't log back in if they somehow get through Access.</Tip>

          <H>Rotating the shared password</H>
          <div className="space-y-1.5">
            <Step n={1}>Go to <strong>Azure Portal</strong> → Function Apps → dietswad-api.</Step>
            <Step n={2}>Navigate to <strong>Configuration → Application Settings</strong>.</Step>
            <Step n={3}>Find <strong>PWA_SHARED_PASSWORD</strong> and update it to a new strong password.</Step>
            <Step n={4}>Click <strong>Save</strong>. All existing logins are invalidated — the team will see "Invalid password" on their next use and need to log in with the new password.</Step>
            <Step n={5}>Share the new password securely with all active team members.</Step>
          </div>
          <Warn>
            Rotating the password logs out ALL team members immediately. Do it outside working hours
            if possible, and have the new password ready to share.
          </Warn>
        </Section>

        {/* 17 */}
        <Section title="17. Troubleshooting & FAQ" tags="📱 Mobile · 👤 Everyone">
          <div className="space-y-3">
            <div>
              <p className="font-semibold text-xs text-espresso">❓ I got logged out — why?</p>
              <p className="text-xs text-ink/70 mt-0.5">The login token expires after 24 hours. Just enter the shared password again. If it says "Invalid password", the password may have been rotated — ask the owner for the new one.</p>
            </div>
            <div>
              <p className="font-semibold text-xs text-espresso">❓ I see the Cloudflare Access screen again</p>
              <p className="text-xs text-ink/70 mt-0.5">Your device session expired (sessions last 1 week). Enter your email, get the one-time PIN, and you're back in. If your email doesn't work, you may have been removed from the team list.</p>
            </div>
            <div>
              <p className="font-semibold text-xs text-espresso">❓ The app is showing old data / wrong screen</p>
              <p className="text-xs text-ink/70 mt-0.5">The service worker (offline cache) may be showing an old version. On Android Chrome: Settings → Site settings → dietswad.in → Clear &amp; reset. Then reload. On iPhone: close and reopen Safari.</p>
            </div>
            <div>
              <p className="font-semibold text-xs text-espresso">❓ I see an offline/error page</p>
              <p className="text-xs text-ink/70 mt-0.5">Check your internet connection. If you're online, try a hard reload (Chrome: pull down to refresh). If the backend is down, all order operations will fail — check Azure status or contact the owner.</p>
            </div>
            <div>
              <p className="font-semibold text-xs text-espresso">❓ "Failed to create order" error</p>
              <p className="text-xs text-ink/70 mt-0.5">Usually a Notion API timeout. Wait 30 seconds and try again. If it persists, check the Azure Function is running (owner task).</p>
            </div>
            <div>
              <p className="font-semibold text-xs text-espresso">❓ The "Send Invoice" button is greyed out</p>
              <p className="text-xs text-ink/70 mt-0.5">The order has no valid email address. The customer's email needs to be added directly in Notion for now (the Edit screen doesn't have an email field).</p>
            </div>
            <div>
              <p className="font-semibold text-xs text-espresso">❓ Dashboards show no data / placeholder tiles</p>
              <p className="text-xs text-ink/70 mt-0.5">The full analytics pipeline (Phase 4) hasn't been built yet. The tiles are placeholders. Orders dashboard data is coming in a future update.</p>
            </div>
            <div>
              <p className="font-semibold text-xs text-espresso">❓ A customer says they didn't get the invoice email</p>
              <p className="text-xs text-ink/70 mt-0.5">Ask them to check spam. The sender is a Gmail address (dietswad Gmail account). If they can't find it, you can send again from the Order Detail screen — it creates a new invoice number.</p>
            </div>
            <div>
              <p className="font-semibold text-xs text-espresso">❓ Short link not working / redirecting wrong</p>
              <p className="text-xs text-ink/70 mt-0.5">Try opening the link in an incognito window. If it fails there too, purge the Cloudflare cache (see section 15). If still broken, check the short link details in the Shortener screen — the destination URL may be wrong.</p>
            </div>
          </div>
        </Section>

        {/* 18 */}
        <Section title="18. Key decisions & why we built it this way" tags="🛠 Owner">
          <p className="text-xs text-ink/50 italic">For the owner's reference — context on major architectural and product decisions.</p>
          <div className="space-y-3 mt-1">
            <div>
              <p className="font-semibold text-xs">PWA instead of a native Android app</p>
              <p className="text-xs text-ink/70 mt-0.5">An Android app rebuild was started but abandoned. Maintaining separate Android + web codebases for a 3-person team doesn't make sense. A PWA installs from the browser, works on any device, and deploys instantly via git push. The old Android app is frozen and kept only for its URL shortener screens.</p>
            </div>
            <div>
              <p className="font-semibold text-xs">Notion as the order database</p>
              <p className="text-xs text-ink/70 mt-0.5">Free, zero infrastructure to manage, and the team can view/edit orders directly in Notion as a fallback. The app is a layer on top — Notion is always the source of truth. A dedicated database (PostgreSQL etc.) would add cost and ops overhead that isn't justified at current scale.</p>
            </div>
            <div>
              <p className="font-semibold text-xs">Azure Functions (serverless) for the backend</p>
              <p className="text-xs text-ink/70 mt-0.5">The backend only needs to respond to order events — it doesn't need to run 24/7. Serverless means near-zero cost at low volumes, auto-scaling if we grow, and no server to maintain. Azure integrates with Azure Table Storage (URL shortener click counts) and Azure Blob (future dashboard data). Invoice rendering (PDF) runs as a separate GitHub Actions job to avoid timeout limits on Azure Functions.</p>
            </div>
            <div>
              <p className="font-semibold text-xs">Cloudflare Access for the internal app</p>
              <p className="text-xs text-ink/70 mt-0.5">We needed the PWA locked to the team without building our own user management system. Cloudflare Access (email OTP + device certificates) gives enterprise-grade access control for free, with zero code to maintain. The alternative — per-user accounts — would add weeks of development and ongoing maintenance.</p>
            </div>
            <div>
              <p className="font-semibold text-xs">Shared password + JWT (not per-user accounts)</p>
              <p className="text-xs text-ink/70 mt-0.5">At 3–5 users who are all trusted team members, a full user account system (registrations, password resets, roles, etc.) adds complexity with no real benefit. The Cloudflare Access layer already identifies who is accessing the app via their email. If we grow to 15+ users, per-user auth would be revisited.</p>
            </div>
            <div>
              <p className="font-semibold text-xs">Dashboards on private Azure Blob, not GitHub Pages</p>
              <p className="text-xs text-ink/70 mt-0.5">The PWA repo is public on GitHub (simpler for deployment). Putting dashboard JSON (which contains revenue figures and customer counts) in a public repo would be a data leak. Dashboard data is generated as private blobs in Azure and fetched via a JWT-authenticated API call.</p>
            </div>
            <div>
              <p className="font-semibold text-xs">Flat dietswad.in/{'{code}'} short links</p>
              <p className="text-xs text-ink/70 mt-0.5">Short links under the main domain (not a subdomain like go.dietswad.in) look cleaner in Instagram bios and WhatsApp messages. A flat structure like dietswad.in/summer is more memorable than dietswad.in/go/summer.</p>
            </div>
            <div>
              <p className="font-semibold text-xs">₹499 uniform retail price</p>
              <p className="text-xs text-ink/70 mt-0.5">Simple, consistent pricing makes WhatsApp selling easier — workers don't need to calculate per-item. The app supports per-product pricing (set in the products catalog) but ₹499 is the default floor for all current SKUs.</p>
            </div>
          </div>
        </Section>

        {/* 19 */}
        <Section title="19. Glossary — plain English definitions" tags="👤 Everyone">
          <div className="space-y-2">
            <div>
              <p className="font-semibold text-xs text-espresso">PWA (Progressive Web App)</p>
              <p className="text-xs text-ink/70">A website that behaves like a native app. Can be installed on your home screen, works offline, and receives push notifications — without going through an app store.</p>
            </div>
            <div>
              <p className="font-semibold text-xs text-espresso">Install to home screen</p>
              <p className="text-xs text-ink/70">Adding the PWA to your phone's home screen so it opens like an app (full screen, no browser bar). Same as installing from an app store, except it's done from the browser.</p>
            </div>
            <div>
              <p className="font-semibold text-xs text-espresso">JWT / login token</p>
              <p className="text-xs text-ink/70">A small piece of encrypted data stored on your device after you log in. It proves to the server that you're allowed in, without sending your password on every action. Expires after 24 hours.</p>
            </div>
            <div>
              <p className="font-semibold text-xs text-espresso">Cloudflare</p>
              <p className="text-xs text-ink/70">A global network that sits in front of our website and app. It speeds up page loads (by caching copies near users), protects against attacks, and handles the Access gate for the internal app.</p>
            </div>
            <div>
              <p className="font-semibold text-xs text-espresso">Cloudflare Access / OTP</p>
              <p className="text-xs text-ink/70">The login gate before the internal app. Cloudflare checks that your email is on the approved list, then emails you a one-time PIN (OTP) to prove you own that email. Session lasts 1 week.</p>
            </div>
            <div>
              <p className="font-semibold text-xs text-espresso">Cache / Purge cache</p>
              <p className="text-xs text-ink/70">Cloudflare stores copies of our website pages to serve them fast. "Purging the cache" deletes those copies so the latest version is fetched fresh. Needed after website changes that aren't showing up.</p>
            </div>
            <div>
              <p className="font-semibold text-xs text-espresso">Notion</p>
              <p className="text-xs text-ink/70">The tool where all Diet Swad order data lives. Think of it as a very powerful spreadsheet in the cloud. The app reads from and writes to Notion via an API — but you can also open Notion directly to view or edit orders.</p>
            </div>
            <div>
              <p className="font-semibold text-xs text-espresso">Azure Function (serverless)</p>
              <p className="text-xs text-ink/70">A piece of backend code (the API) that runs only when called, not continuously. Like switching on a light only when you need it. Microsoft's Azure cloud hosts it.</p>
            </div>
            <div>
              <p className="font-semibold text-xs text-espresso">Repository (repo)</p>
              <p className="text-xs text-ink/70">A folder of code stored on GitHub. Public repos are visible to everyone on the internet. Private repos are visible only to people you invite. We use GitHub to store, version, and automatically deploy our code.</p>
            </div>
            <div>
              <p className="font-semibold text-xs text-espresso">UTM tag / UTM link</p>
              <p className="text-xs text-ink/70">Extra information added to the end of a URL (e.g. ?utm_source=instagram) that tells Google Analytics or our own tracking where a visitor came from. The Share Link feature generates these automatically per channel.</p>
            </div>
            <div>
              <p className="font-semibold text-xs text-espresso">RTO (Return to Origin)</p>
              <p className="text-xs text-ink/70">When a shipped order comes back — the delivery failed. Common reasons: wrong address, customer not available, refused. The app lets you log the outcome, reason, and the return shipping cost absorbed.</p>
            </div>
            <div>
              <p className="font-semibold text-xs text-espresso">COD (Cash on Delivery)</p>
              <p className="text-xs text-ink/70">The customer pays in cash when the order is delivered, not in advance. The app tracks COD amounts separately and marks them as "collected" when you tap Mark Delivered.</p>
            </div>
            <div>
              <p className="font-semibold text-xs text-espresso">Partial COD</p>
              <p className="text-xs text-ink/70">A split payment — part paid online in advance (e.g. ₹200 via UPI) and the rest (₹299) collected as cash on delivery. The Order Detail screen shows both amounts separately.</p>
            </div>
          </div>
        </Section>

        {/* Footer */}
        <div className="pt-2 pb-4 text-center">
          <p className="text-xs text-ink/30">Diet Swad Internal · v2.0 · Radiant Twins Enterprise</p>
          <p className="text-xs text-ink/20 mt-0.5">Last updated: May 2026</p>
        </div>

      </main>
    </div>
  )
}
