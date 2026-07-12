const fs = require('fs');
const path = 'features/transfers/payments.html';
let content = fs.readFileSync(path, 'utf-8');

// 1. Add invalid-feedback divs to the HTML
// select-1
content = content.replace(
    '<select class="form-select text-muted ps-5 py-3" id="select-1" style="border-radius: 0.5rem; font-size: 0.95rem;">',
    '<select class="form-select text-muted ps-5 py-3" id="select-1" style="border-radius: 0.5rem; font-size: 0.95rem;">'
); // wait, need to find the parent div and append it
content = content.replace(
    '<select class="form-select text-muted ps-5 py-3" id="select-1" style="border-radius: 0.5rem; font-size: 0.95rem;">\n                            <option selected>Select Biller/Operator</option>\n                            <option>Jio Prepaid</option>\n                            <option>Airtel Prepaid</option>\n                            <option>Vi Prepaid</option>\n                        </select>',
    `<select class="form-select text-muted ps-5 py-3" id="select-1" style="border-radius: 0.5rem; font-size: 0.95rem;">
                            <option selected>Select Biller/Operator</option>
                            <option>Jio Prepaid</option>
                            <option>Airtel Prepaid</option>
                            <option>Vi Prepaid</option>
                        </select>
                        <div class="invalid-feedback" id="select-1-error">Please select an operator.</div>`
);

// input-2
content = content.replace(
    '<input type="text" class="form-control text-muted ps-5 py-3" placeholder="Enter 10-digit mobile number" id="input-2" style="border-radius: 0.5rem; font-size: 0.95rem;">',
    `<input type="text" class="form-control text-muted ps-5 py-3" placeholder="Enter 10-digit mobile number" id="input-2" style="border-radius: 0.5rem; font-size: 0.95rem;">
                        <div class="invalid-feedback" id="input-2-error">Please enter a valid number.</div>`
);

// amountInput
content = content.replace(
    `<input type="number" class="form-control py-3 ps-5" placeholder="Enter Amount" style="border-radius: 0.5rem; font-size: 0.95rem;" min="1" onkeydown="if(event.key==='-') event.preventDefault()">`,
    `<input type="number" class="form-control py-3 ps-5" placeholder="Enter Amount" style="border-radius: 0.5rem; font-size: 0.95rem;" min="1" onkeydown="if(event.key==='-') event.preventDefault()">
                        <div class="invalid-feedback" id="amount-error">Please enter a valid amount greater than 0.</div>`
);

// 2. Replace processPayment function
const oldStart = 'function processPayment(btn) {';
const oldEnd = 'btn.disabled = true;';
const startIndex = content.indexOf(oldStart);
const endIndex = content.indexOf(oldEnd, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
    const oldBlock = content.substring(startIndex, endIndex);
    const newBlock = `function processPayment(btn) {
      const select1 = document.getElementById('select-1');
      const input2 = document.getElementById('input-2');
      const amountInput = document.querySelector('input[type="number"]');
      
      const select1Error = document.getElementById('select-1-error');
      const input2Error = document.getElementById('input-2-error');
      const amountError = document.getElementById('amount-error');

      // Clear previous errors
      if (select1) select1.classList.remove('is-invalid');
      if (input2) input2.classList.remove('is-invalid');
      if (amountInput) amountInput.classList.remove('is-invalid');
      
      const activeBox = document.querySelector('.transfer-type-box.active');
      const billerName = activeBox && activeBox.innerText ? activeBox.innerText.trim() : 'Mobile';

      let hasError = false;
      
      if (!select1 || select1.selectedIndex === 0) {
          if (select1) select1.classList.add('is-invalid');
          if (select1Error) select1Error.innerText = 'Please select a provider/operator.';
          hasError = true;
      }
      
      const val2 = input2 ? input2.value.trim() : '';
      if (!val2) {
          if (input2) input2.classList.add('is-invalid');
          if (input2Error) input2Error.innerText = 'This field is required.';
          hasError = true;
      } else if (billerName === 'Mobile' && !/^\\d{10}$/.test(val2)) {
          if (input2) input2.classList.add('is-invalid');
          if (input2Error) input2Error.innerText = 'Please enter a valid 10-digit mobile number.';
          hasError = true;
      }
      
      const amount = amountInput ? parseFloat(amountInput.value) : 0;
      if (!amount || amount <= 0) {
          if (amountInput) amountInput.classList.add('is-invalid');
          if (amountError) amountError.innerText = 'Please enter a valid positive amount.';
          hasError = true;
      }
      
      if (hasError) {
          return;
      }
      
      // Simulate async payment processing
      `;
    content = content.replace(oldBlock, newBlock);
    
    fs.writeFileSync(path, content, 'utf-8');
    console.log('Fixed inline validations in payments.html');
} else {
    console.log('Could not find processPayment function block');
}
