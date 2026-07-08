import { pauseScroll, resumeScroll } from '../lib/lenis-gsap.js';

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

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;
    const emailInput = document.getElementById('client-email');
    successEmailPlaceholder.textContent = emailInput.value;
    currentStep = 4;
    updateStepView();
  });

  const resetModal = () => {
    currentStep = 1;
    form.reset();
    form.querySelectorAll('.form-field').forEach((f) => f.classList.remove('invalid'));
    step1ValidationMsg.style.display = 'none';
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
