import emailjs from '@emailjs/browser';
import { pauseScroll, resumeScroll } from '../lib/lenis-gsap.js';
import { EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY, isEmailConfigured } from '../lib/emailConfig.js';

const SERVICE_LABELS = {
  web: 'Web Dev',
  app: 'App Dev',
  ai: 'AI & Automation',
  agents: 'AI Agents',
  cloud: 'Cloud/DevOps',
  shopify: 'Shopify Store',
};

export function initProjectBuilder() {
  const modal = document.getElementById('project-builder-modal');
  const triggers = document.querySelectorAll('.trigger-project-builder');
  const closeBtn = modal.querySelector('.modal-close');
  const closeSuccessBtn = modal.querySelector('.close-modal-btn');
  const form = document.getElementById('project-builder-form');
  const steps = form.querySelectorAll('.modal-step-content');

  const progressBar = document.getElementById('modal-progress-bar');
  const step1ValidationMsg = document.getElementById('step1-validation');

  const budgetRange = document.getElementById('budget-range');
  const budgetValueText = document.getElementById('budget-value');
  const successEmailPlaceholder = document.getElementById('success-email-placeholder');

  const tiers = {
    mvp: document.getElementById('tier-mvp'),
    pro: document.getElementById('tier-pro'),
    enterprise: document.getElementById('tier-enterprise'),
  };

  let currentStep = 1;

  const openModal = () => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    pauseScroll();
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    resumeScroll();
  };

  triggers.forEach((btn) => btn.addEventListener('click', openModal));
  closeBtn.addEventListener('click', closeModal);
  closeSuccessBtn?.addEventListener('click', () => {
    closeModal();
    resetModal();
  });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  const updateStepView = () => {
    steps.forEach((step) => {
      step.classList.toggle('active', parseInt(step.dataset.step, 10) === currentStep);
    });
    const widthPct = ((currentStep - 1) / 3) * 100 + 10;
    progressBar.style.width = `${Math.min(100, widthPct)}%`;
  };

  const validateStep = (step) => {
    if (step === 1) {
      const selected = form.querySelectorAll('input[name="services"]:checked');
      const isValid = selected.length > 0;
      step1ValidationMsg.style.display = isValid ? 'none' : 'block';
      return isValid;
    }
    if (step === 3) {
      let isStepValid = true;
      const nameInput = document.getElementById('client-name');
      const emailInput = document.getElementById('client-email');

      if (!nameInput.value.trim()) {
        nameInput.parentElement.classList.add('invalid');
        isStepValid = false;
      } else {
        nameInput.parentElement.classList.remove('invalid');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        emailInput.parentElement.classList.add('invalid');
        isStepValid = false;
      } else {
        emailInput.parentElement.classList.remove('invalid');
      }
      return isStepValid;
    }
    return true;
  };

  form.querySelectorAll('input[required]').forEach((input) => {
    input.addEventListener('input', () => {
      if (input.value.trim()) input.parentElement.classList.remove('invalid');
    });
  });

  form.querySelectorAll('.modal-next').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!validateStep(currentStep)) return;
      if (currentStep < 3) {
        currentStep++;
        updateStepView();
      } else {
        const emailInput = document.getElementById('client-email');
        successEmailPlaceholder.textContent = emailInput.value;
        currentStep = 4;
        updateStepView();
      }
    });
  });

  form.querySelectorAll('.modal-back').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        updateStepView();
      }
    });
  });

  const submitBtn = document.getElementById('submit-btn');
  const submitBtnText = document.getElementById('submit-btn-text');
  const submitError = document.getElementById('submit-error');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    const nameInput = document.getElementById('client-name');
    const emailInput = document.getElementById('client-email');
    const selectedServices = Array.from(form.querySelectorAll('input[name="services"]:checked'))
      .map((el) => SERVICE_LABELS[el.value] || el.value);

    const templateParams = {
      from_name: nameInput.value.trim(),
      from_email: emailInput.value.trim(),
      services: selectedServices.join(', '),
      budget: `$${parseInt(budgetRange.value, 10).toLocaleString()}`,
    };

    submitError.style.display = 'none';
    submitBtn.disabled = true;
    submitBtnText.textContent = 'Sending...';

    try {
      if (isEmailConfigured) {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, { publicKey: EMAILJS_PUBLIC_KEY });
      } else {
        console.warn('EmailJS is not configured yet (src/lib/emailConfig.js) -- form data was not actually sent:', templateParams);
      }
      successEmailPlaceholder.textContent = emailInput.value;
      currentStep = 4;
      updateStepView();
    } catch (err) {
      console.error('EmailJS send failed:', err);
      submitError.style.display = 'block';
    } finally {
      submitBtn.disabled = false;
      submitBtnText.textContent = 'Submit Blueprint';
    }
  });

  const resetModal = () => {
    currentStep = 1;
    form.reset();
    form.querySelectorAll('.form-field').forEach((f) => f.classList.remove('invalid'));
    step1ValidationMsg.style.display = 'none';
    submitError.style.display = 'none';
    budgetValueText.textContent = '15,000';
    tiers.mvp.classList.add('active');
    tiers.pro.classList.remove('active');
    tiers.enterprise.classList.remove('active');
    updateStepView();
  };

  budgetRange.addEventListener('input', (e) => {
    const budget = parseInt(e.target.value, 10);
    budgetValueText.textContent = budget.toLocaleString();

    tiers.mvp.classList.remove('active');
    tiers.pro.classList.remove('active');
    tiers.enterprise.classList.remove('active');

    if (budget < 25000) tiers.mvp.classList.add('active');
    else if (budget < 75000) tiers.pro.classList.add('active');
    else tiers.enterprise.classList.add('active');
  });

  updateStepView();
}
