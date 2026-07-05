const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'css', 'main.css');

if(fs.existsSync(cssPath)) {
    let content = fs.readFileSync(cssPath, 'utf8');
    
    const newCss = `
/* Password Strength Indicator */
#passwordStrengthContainer .progress {
    background-color: #e9ecef;
    border-radius: 10px;
    overflow: hidden;
}

#passwordStrengthContainer .progress-bar {
    transition: width 0.4s ease, background-color 0.4s ease;
    border-radius: 10px;
}

/* Validation Styling Overrides */
.input-group.has-validation > .form-control:invalid ~ .invalid-feedback,
.input-group.has-validation > .form-control.is-invalid ~ .invalid-feedback,
.has-validation > .form-control:invalid ~ .invalid-feedback,
.has-validation > .form-control.is-invalid ~ .invalid-feedback {
    display: block;
}

.form-control.is-invalid, .was-validated .form-control:invalid {
    border-color: #dc3545 !important;
}

.input-group.has-validation > .form-control.is-invalid {
    z-index: 3;
}
`;

    if(!content.includes('/* Password Strength Indicator */')) {
        content += '\n' + newCss;
        fs.writeFileSync(cssPath, content, 'utf8');
        console.log("Updated main.css successfully.");
    } else {
        console.log("CSS already updated.");
    }
}
