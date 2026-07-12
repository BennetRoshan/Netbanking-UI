/**
 * Nexus Bank – Core Banking Logic
 * Depends on: constants.js, helpers.js
 */
const NexusBank = {
  /**
   * Validate a transfer before submission.
   * Returns { valid: true } or { valid: false, error: "message" }
   */
  validateTransfer({ beneficiary, amount, type }) {
    if (!beneficiary || beneficiary === '' || beneficiary === 'Select Beneficiary') {
      return { valid: false, error: 'Please select a beneficiary.' };
    }
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      return { valid: false, error: 'Please enter a valid amount greater than ₹0.' };
    }
    const perTxnLimit = type === 'NEFT'
      ? NEXUS_CONSTANTS.TRANSFER_LIMITS.NEFT_PER_TXN
      : NEXUS_CONSTANTS.TRANSFER_LIMITS.IMPS_PER_TXN;
    if (amt > perTxnLimit) {
      return { valid: false, error: `Amount exceeds the per-transaction limit of ${NexusHelpers.formatINR(perTxnLimit)} for ${type}.` };
    }
    const availableBalance = NexusHelpers.getAvailableBalance();
    if (amt > availableBalance) {
      return { valid: false, error: 'Insufficient funds. Your available balance is ' + NexusHelpers.formatINR(availableBalance) + '.' };
    }
    const used = NexusHelpers.getDailyUsage();
    const remaining = NEXUS_CONSTANTS.TRANSFER_LIMITS.DAILY_LIMIT - used;
    if (amt > remaining) {
      return { valid: false, error: `Amount exceeds your remaining daily limit of ${NexusHelpers.formatINR(remaining)}.` };
    }
    return { valid: true };
  },
  /**
   * Show OTP confirmation modal.
   * opts: { summary: "HTML string", onSuccess: fn(txnRef) }
   */
  showOTPModal({ summary, amount, onSuccess }) {
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setTimeout(() => alert('Your Nexus Bank OTP is: ' + generatedOtp), 500);
    let failedAttempts = 0;
    // Remove any existing modal
    const existing = document.getElementById('nexusOtpModal');
    if (existing) existing.remove();
    const modalHtml = `
    <div class="modal fade" id="nexusOtpModal" tabindex="-1" data-bs-backdrop="static" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 rounded-4 shadow">
          <div class="modal-header border-bottom-0 pb-0">
            <h5 class="modal-title fw-bold text-dark">Confirm Transfer</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body pt-3 px-4">
            <div class="bg-light rounded-3 p-3 mb-4" id="nexusOtpSummary">${summary}</div>
            <div class="bg-warning-subtle border border-warning-subtle rounded-3 p-3 mb-4 d-flex align-items-center gap-2" style="font-size:0.85rem;">
              <i class="bi bi-shield-lock text-warning fs-5"></i>
              <span>A 6-digit OTP has been sent to your registered mobile number.</span>
            </div>
            <div class="mb-3">
              <label class="form-label fw-bold small text-dark">Enter OTP</label>
              <input type="text" id="nexusOtpInput" class="form-control py-3 text-center fw-bold fs-5 letter-spacing-2"
                maxlength="6" inputmode="numeric" placeholder="• • • • • •" autocomplete="one-time-code">
              <div class="invalid-feedback" id="nexusOtpError">Please enter a valid 6-digit OTP.</div>
            </div>
            <small class="text-muted d-block mb-2" id="nexusOtpTimer">OTP expires in <span id="nexusOtpCountdown">120</span>s</small>
          </div>
          <div class="modal-footer border-top-0 pb-4 px-4">
            <button type="button" class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary rounded-pill px-5 fw-bold" id="nexusOtpConfirmBtn">
              <span id="nexusOtpBtnText">Verify & Transfer</span>
              <span class="spinner-border spinner-border-sm ms-2 d-none" id="nexusOtpSpinner"></span>
            </button>
          </div>
        </div>
      </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modalEl = document.getElementById('nexusOtpModal');
    const bsModal = new bootstrap.Modal(modalEl);
    bsModal.show();
    // OTP countdown
    let countdown = NEXUS_CONSTANTS.OTP_EXPIRY_SECONDS;
    const countdownEl = document.getElementById('nexusOtpCountdown');
    const timer = setInterval(() => {
      countdown--;
      if (countdownEl) countdownEl.textContent = countdown;
      if (countdown <= 0) {
        clearInterval(timer);
        const otpInput = document.getElementById('nexusOtpInput');
        const confirmBtn = document.getElementById('nexusOtpConfirmBtn');
        if (otpInput) otpInput.disabled = true;
        if (confirmBtn) confirmBtn.disabled = true;
        const timerEl = document.getElementById('nexusOtpTimer');
        if (timerEl) timerEl.innerHTML = '<span class="text-danger fw-medium">OTP expired. Please try again.</span>';
      }
    }, 1000);
    modalEl.addEventListener('hidden.bs.modal', () => {
      clearInterval(timer);
      modalEl.remove();
    });
    // OTP input — digits only
    const otpInput = document.getElementById('nexusOtpInput');
    otpInput.addEventListener('input', () => {
      otpInput.value = otpInput.value.replace(/[^0-9]/g, '');
      otpInput.classList.remove('is-invalid');
    });
    // Confirm button
    document.getElementById('nexusOtpConfirmBtn').addEventListener('click', () => {
      const otp = otpInput.value.trim();
      if (!/^[0-9]{6}$/.test(otp)) {
        otpInput.classList.add('is-invalid');
        document.getElementById('nexusOtpError').textContent = 'Please enter a valid 6-digit OTP.';
        return;
      }
      
      if (otp !== generatedOtp) {
          failedAttempts++;
          if (failedAttempts >= 3) {
              clearInterval(timer);
              bsModal.hide();
              alert('Transaction locked due to too many failed OTP attempts. Please restart your transaction.');
              location.reload();
              return;
          }
          otpInput.classList.add('is-invalid');
          document.getElementById('nexusOtpError').textContent = `Invalid OTP. Attempts left: ${3 - failedAttempts}`;
          return;
      }

      // Simulate async OTP verification
      const btn = document.getElementById('nexusOtpConfirmBtn');
      const btnText = document.getElementById('nexusOtpBtnText');
      const spinner = document.getElementById('nexusOtpSpinner');
      btn.disabled = true;
      btnText.textContent = 'Verifying...';
      spinner.classList.remove('d-none');
      setTimeout(() => {
        clearInterval(timer);
        bsModal.hide();
        const txnRef = NexusHelpers.generateTxnRef();
        if (amount) NexusHelpers.addDailyUsage(amount);
        if (onSuccess) onSuccess(txnRef);
      }, 1500);
    });
  },
  /**
   * Show a full-page success state inside a container element.
   */
  showSuccessState(container, { title, message, txnRef }) {
    container.innerHTML = `
      <div class="text-center py-5 my-3">
        <div class="mb-4">
          <i class="bi bi-check-circle-fill text-success" style="font-size: 4.5rem;"></i>
        </div>
        <h3 class="fw-bold text-dark mb-2">${title}</h3>
        <p class="text-muted mb-4">${message}</p>
        <div class="bg-light rounded-3 p-3 d-inline-block mb-5">
          <small class="text-muted d-block mb-1">Transaction Reference</small>
          <span class="fw-bold text-dark font-monospace">${txnRef}</span>
        </div>
        <div>
          <button class="btn btn-primary px-5 py-3 rounded-pill fw-bold" onclick="location.reload()">
            Make Another Transfer
          </button>
        </div>
      </div>`;
  }
};
