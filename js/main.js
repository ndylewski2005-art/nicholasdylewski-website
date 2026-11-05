// Mobile menu toggle
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');
if (toggle && links) {
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
}

// Show a labeled placeholder for any photo that hasn't been added yet
document.querySelectorAll('.photo img').forEach((img) => {
  const mark = () => img.parentElement.classList.add('missing');
  if (img.complete && img.naturalWidth === 0) mark();
  img.addEventListener('error', mark);
});

// Footer year
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

// Contact form: sends the message straight to the inbox through Web3Forms
const form = document.getElementById('contact-form');
if (form) {
  const status = document.getElementById('form-status');
  const show = (html) => { status.innerHTML = html; status.hidden = false; };
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const d = new FormData(form);
    const btn = form.querySelector('button[type=submit]');
    btn.disabled = true; btn.textContent = 'Sending...';
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: form.dataset.key,
          subject: `Website message from ${d.get('name')}: ${d.get('reason')}`,
          from_name: 'nicholasdylewski.com',
          name: d.get('name'), email: d.get('email'),
          reason: d.get('reason'), message: d.get('message'),
        }),
      });
      const text = await res.text();
      let out = {};
      try { out = JSON.parse(text); } catch (_) { out = { message: `HTTP ${res.status}` }; }
      if (!out.success) throw new Error(out.message || `HTTP ${res.status}`);
      form.reset();
      show('<p><strong>Thanks, your message was sent!</strong> I&rsquo;ll get back to you soon.</p>');
    } catch (err) {
      const to = form.dataset.email;
      show(`<p>Sorry, the message couldn&rsquo;t be sent right now. Please email me directly at <a href="mailto:${to}">${to}</a>.</p><p style="font-size:.8rem;color:#8a6d00;margin-top:8px">Details: ${String(err && err.message || err).replace(/</g, '&lt;')}</p>`);
    } finally {
      btn.disabled = false; btn.textContent = 'Send message';
    }
  });
}
