// Vaultara - Professional File Encryption Application
// COMPLETELY FIXED VERSION - All critical issues resolved

// Security configuration
const SECURITY_CONFIG = {
    algorithm: 'AES-GCM',
    keyLength: 256,
    ivLength: 12,
    saltLength: 16,
    tagLength: 16,
    iterations: 100000,
    maxFileSize: 4 * 1024 * 1024 * 1024 // 4GB limit - CONSISTENT everywhere
};

// Global state
let selectedFile = null;
let encryptedFileData = null;
let decryptedFileData = null;
let currentNotificationTimeout = null;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Vaultara initializing...');
    initializeApp();
});

function initializeApp() {
    try {
        console.log('Setting up event listeners...');
        setupEventListeners();
        setupPasswordToggles();
        setupCopyButtons();
        setupModalHandlers();
        showMainScreen();
        console.log('Vaultara initialized successfully');
    } catch (error) {
        console.error('Initialization error:', error);
    }
}

// CRITICAL FIX: Event listener setup with robust error handling
function setupEventListeners() {
    try {
        // Main navigation buttons
        const encryptBtn = document.getElementById('encrypt-btn');
        const decryptBtn = document.getElementById('decrypt-btn');
        
        if (encryptBtn) {
            encryptBtn.addEventListener('click', function(e) {
                console.log('Encrypt button clicked');
                e.preventDefault();
                e.stopPropagation();
                showEncryptScreen();
            });
        }
        
        if (decryptBtn) {
            decryptBtn.addEventListener('click', function(e) {
                console.log('Decrypt button clicked');
                e.preventDefault();
                e.stopPropagation();
                showDecryptScreen();
            });
        }
        
        // Back buttons
        const encryptBack = document.getElementById('encrypt-back');
        const decryptBack = document.getElementById('decrypt-back');
        
        if (encryptBack) {
            encryptBack.addEventListener('click', function(e) {
                console.log('Encrypt back clicked');
                e.preventDefault();
                e.stopPropagation();
                showMainScreen();
            });
        }
        
        if (decryptBack) {
            decryptBack.addEventListener('click', function(e) {
                console.log('Decrypt back clicked');
                e.preventDefault();
                e.stopPropagation();
                showMainScreen();
            });
        }
        
        // CRITICAL FIX: File upload setup
        setupFileUpload('encrypt');
        setupFileUpload('decrypt');
        
        // Action buttons
        const encryptContinue = document.getElementById('encrypt-continue');
        const startEncrypt = document.getElementById('start-encrypt');
        const startDecrypt = document.getElementById('start-decrypt');
        
        if (encryptContinue) {
            encryptContinue.addEventListener('click', function(e) {
                console.log('Encrypt continue clicked');
                e.preventDefault();
                e.stopPropagation();
                showPasswordStep();
            });
        }
        
        if (startEncrypt) {
            startEncrypt.addEventListener('click', function(e) {
                console.log('Start encrypt clicked');
                e.preventDefault();
                e.stopPropagation();
                startEncryption();
            });
        }
        
        if (startDecrypt) {
            startDecrypt.addEventListener('click', function(e) {
                console.log('Start decrypt clicked');
                e.preventDefault();
                e.stopPropagation();
                startDecryption();
            });
        }
        
        // Download buttons
        const downloadEncrypted = document.getElementById('download-encrypted');
        const downloadDecrypted = document.getElementById('download-decrypted');
        
        if (downloadEncrypted) {
            downloadEncrypted.addEventListener('click', function(e) {
                console.log('Download encrypted clicked');
                e.preventDefault();
                e.stopPropagation();
                downloadEncryptedFile();
            });
        }
        
        if (downloadDecrypted) {
            downloadDecrypted.addEventListener('click', function(e) {
                console.log('Download decrypted clicked');
                e.preventDefault();
                e.stopPropagation();
                downloadDecryptedFile();
            });
        }
        
        // New file buttons
        const encryptNew = document.getElementById('encrypt-new');
        const decryptNew = document.getElementById('decrypt-new');
        
        if (encryptNew) {
            encryptNew.addEventListener('click', function(e) {
                console.log('Encrypt new clicked');
                e.preventDefault();
                e.stopPropagation();
                showMainScreen();
            });
        }
        
        if (decryptNew) {
            decryptNew.addEventListener('click', function(e) {
                console.log('Decrypt new clicked');
                e.preventDefault();
                e.stopPropagation();
                showMainScreen();
            });
        }
        
        // Password strength checker
        const encryptPassword = document.getElementById('encrypt-password');
        if (encryptPassword) {
            encryptPassword.addEventListener('input', updatePasswordStrength);
        }
        
        console.log('Event listeners setup complete');
    } catch (error) {
        console.error('Error setting up event listeners:', error);
    }
}

// CRITICAL FIX: File upload setup that actually works for clicks AND drag-drop
function setupFileUpload(type) {
    try {
        const uploadZone = document.getElementById(`${type}-upload-zone`);
        const fileInput = document.getElementById(`${type}-file-input`);
        
        console.log(`Setting up file upload for ${type}:`, {
            uploadZone: !!uploadZone,
            fileInput: !!fileInput
        });
        
        if (uploadZone && fileInput) {
            // CRITICAL FIX: Direct file input setup
            fileInput.style.display = 'none';
            fileInput.style.position = 'absolute';
            fileInput.style.left = '-9999px';
            fileInput.style.top = '-9999px';
            fileInput.style.opacity = '0';
            fileInput.style.pointerEvents = 'none';
            fileInput.setAttribute('accept', '*/*');
            
            // CRITICAL FIX: Click handler that actually opens file manager
            uploadZone.addEventListener('click', function(e) {
                console.log(`${type} upload zone clicked - triggering file input`);
                e.preventDefault();
                e.stopPropagation();
                
                // Multiple methods to ensure file dialog opens
                try {
                    // Method 1: Direct click
                    fileInput.click();
                } catch (error1) {
                    console.warn('Method 1 failed, trying method 2:', error1);
                    try {
                        // Method 2: Dispatch click event
                        const clickEvent = new MouseEvent('click', {
                            bubbles: true,
                            cancelable: true,
                            view: window
                        });
                        fileInput.dispatchEvent(clickEvent);
                    } catch (error2) {
                        console.warn('Method 2 failed, trying method 3:', error2);
                        try {
                            // Method 3: Focus then click
                            fileInput.focus();
                            fileInput.click();
                        } catch (error3) {
                            console.error('All file input trigger methods failed:', error3);
                            showNotification('Unable to open file picker. Please try a different browser.', 'error');
                        }
                    }
                }
            });
            
            // Also try mousedown as backup
            uploadZone.addEventListener('mousedown', function(e) {
                if (e.button === 0) { // Left mouse button
                    setTimeout(() => {
                        try {
                            fileInput.click();
                        } catch (error) {
                            console.warn('Mousedown backup click failed:', error);
                        }
                    }, 10);
                }
            });
            
            // Touch support for mobile
            uploadZone.addEventListener('touchend', function(e) {
                console.log(`${type} upload zone touched`);
                e.preventDefault();
                e.stopPropagation();
                setTimeout(() => {
                    try {
                        fileInput.click();
                    } catch (error) {
                        console.warn('Touch click failed:', error);
                    }
                }, 50);
            });
            
            // Drag and drop handlers
            uploadZone.addEventListener('dragover', function(e) {
                e.preventDefault();
                e.stopPropagation();
                this.classList.add('drag-over');
            });
            
            uploadZone.addEventListener('dragleave', function(e) {
                e.preventDefault();
                e.stopPropagation();
                this.classList.remove('drag-over');
            });
            
            uploadZone.addEventListener('drop', function(e) {
                console.log(`File dropped on ${type} zone`);
                e.preventDefault();
                e.stopPropagation();
                this.classList.remove('drag-over');
                
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    handleFileSelect({ target: { files } }, type);
                }
            });
            
            // CRITICAL FIX: File input change handler
            fileInput.addEventListener('change', function(e) {
                console.log(`${type} file input changed - file selected`);
                handleFileSelect(e, type);
            });
            
            console.log(`File upload setup completed for ${type}`);
        } else {
            console.warn(`Missing elements for ${type} upload:`, {
                uploadZone: !!uploadZone,
                fileInput: !!fileInput
            });
        }
    } catch (error) {
        console.error(`Error setting up ${type} file upload:`, error);
    }
}

// CRITICAL FIX: Password toggle functionality
function setupPasswordToggles() {
    try {
        const toggles = document.querySelectorAll('.password-toggle');
        console.log('Found', toggles.length, 'password toggles');
        
        toggles.forEach((toggle, index) => {
            toggle.addEventListener('click', function(e) {
                console.log('Password toggle', index, 'clicked');
                e.preventDefault();
                e.stopPropagation();
                
                const targetId = this.getAttribute('data-target');
                const input = document.getElementById(targetId);
                
                if (input) {
                    if (input.type === 'password') {
                        input.type = 'text';
                        this.textContent = '🙈';
                    } else {
                        input.type = 'password';
                        this.textContent = '👁️';
                    }
                } else {
                    console.warn('Target input not found:', targetId);
                }
            });
        });
    } catch (error) {
        console.error('Error setting up password toggles:', error);
    }
}

// CRITICAL FIX: Consistent 4GB file size validation
function handleFileSelect(e, type) {
    try {
        const file = e.target.files[0];
        if (!file) {
            console.log('No file selected');
            return;
        }

        console.log('File selected:', {
            name: file.name,
            size: file.size,
            type: file.type
        });

        // FIXED: Validate file size - consistent 4GB limit everywhere
        if (file.size > SECURITY_CONFIG.maxFileSize) {
            showNotification('File size exceeds 4GB limit. Please select a smaller file.', 'error');
            return;
        }

        selectedFile = file;
        displaySelectedFile(file, type);
        
        if (type === 'decrypt') {
            showDecryptForm();
        }
    } catch (error) {
        console.error('Error handling file select:', error);
        showNotification('Error processing selected file', 'error');
    }
}

function displaySelectedFile(file, type) {
    try {
        const preview = document.getElementById(`${type}-file-preview`);
        const uploadZone = document.getElementById(`${type}-upload-zone`);
        const fileName = document.getElementById(`${type}-file-name`);
        const fileSize = document.getElementById(`${type}-file-size`);
        
        if (fileName) fileName.textContent = file.name;
        if (fileSize) fileSize.textContent = formatFileSize(file.size);
        
        if (uploadZone) uploadZone.style.display = 'none';
        if (preview) preview.style.display = 'block';
        
        showNotification('File selected successfully!', 'success');
        console.log('File display updated');
    } catch (error) {
        console.error('Error displaying file:', error);
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Screen navigation functions
function showMainScreen() {
    try {
        console.log('Navigating to main screen');
        hideAllScreens();
        const mainScreen = document.getElementById('main-screen');
        if (mainScreen) {
            mainScreen.classList.add('active');
        }
        resetAllForms();
    } catch (error) {
        console.error('Error showing main screen:', error);
    }
}

function showEncryptScreen() {
    try {
        console.log('Navigating to encrypt screen');
        hideAllScreens();
        const encryptScreen = document.getElementById('encrypt-screen');
        if (encryptScreen) {
            encryptScreen.classList.add('active');
        }
        resetEncryptForm();
    } catch (error) {
        console.error('Error showing encrypt screen:', error);
    }
}

function showDecryptScreen() {
    try {
        console.log('Navigating to decrypt screen');
        hideAllScreens();
        const decryptScreen = document.getElementById('decrypt-screen');
        if (decryptScreen) {
            decryptScreen.classList.add('active');
        }
        resetDecryptForm();
    } catch (error) {
        console.error('Error showing decrypt screen:', error);
    }
}

function hideAllScreens() {
    try {
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => {
            screen.classList.remove('active');
        });
    } catch (error) {
        console.error('Error hiding screens:', error);
    }
}

function showPasswordStep() {
    try {
        const step1 = document.getElementById('encrypt-step-1');
        const step2 = document.getElementById('encrypt-step-2');
        
        if (step1) step1.style.display = 'none';
        if (step2) step2.style.display = 'block';
        
        console.log('Password step shown');
    } catch (error) {
        console.error('Error showing password step:', error);
    }
}

function showDecryptForm() {
    try {
        const form = document.getElementById('decrypt-form');
        if (form) {
            form.style.display = 'block';
        }
        console.log('Decrypt form shown');
    } catch (error) {
        console.error('Error showing decrypt form:', error);
    }
}

// Encryption process with robust error handling
async function startEncryption() {
    try {
        const password = document.getElementById('encrypt-password').value;
        const confirmPassword = document.getElementById('encrypt-password-confirm').value;

        // Validation
        if (!password || !confirmPassword) {
            showNotification('Please enter and confirm your password', 'error');
            return;
        }

        if (password !== confirmPassword) {
            showNotification('Passwords do not match', 'error');
            return;
        }

        if (password.length < 8) {
            showNotification('Password must be at least 8 characters long', 'error');
            return;
        }

        if (!selectedFile) {
            showNotification('No file selected', 'error');
            return;
        }

        // Show processing
        const step2 = document.getElementById('encrypt-step-2');
        const step3 = document.getElementById('encrypt-step-3');
        
        if (step2) step2.style.display = 'none';
        if (step3) step3.style.display = 'block';
        
        showProcessing('encrypt', 'Encrypting your file...');
        console.log('Starting encryption...');

        const result = await encryptFile(selectedFile, password);
        hideProcessing('encrypt');
        showEncryptResult(result);
        showNotification('File encrypted successfully!', 'success');
        console.log('Encryption completed successfully');
    } catch (error) {
        console.error('Encryption error:', error);
        showNotification('Encryption failed: ' + error.message, 'error');
        hideProcessing('encrypt');
    }
}

async function encryptFile(file, password) {
    // Generate cryptographic materials
    const salt = crypto.getRandomValues(new Uint8Array(SECURITY_CONFIG.saltLength));
    const iv = crypto.getRandomValues(new Uint8Array(SECURITY_CONFIG.ivLength));
    
    // Derive key from password using PBKDF2-SHA256
    const key = await deriveKey(password, salt);
    
    // Read file data
    const fileData = await readFileAsArrayBuffer(file);
    
    // Encrypt using AES-256-GCM
    const encrypted = await crypto.subtle.encrypt(
        { name: SECURITY_CONFIG.algorithm, iv: iv },
        key,
        fileData
    );
    
    // Generate secure recovery key
    const recoveryKey = generateRecoveryKey();
    
    // Create metadata
    const metadata = {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        salt: Array.from(salt),
        iv: Array.from(iv),
        recoveryKey: recoveryKey,
        timestamp: Date.now(),
        version: '2.0'
    };
    
    // Combine metadata and encrypted data
    const metadataStr = JSON.stringify(metadata);
    const metadataLength = new Uint32Array([metadataStr.length]);
    const metadataBytes = new TextEncoder().encode(metadataStr);
    
    const combinedData = new Uint8Array(
        4 + metadataBytes.length + encrypted.byteLength
    );
    
    combinedData.set(new Uint8Array(metadataLength.buffer), 0);
    combinedData.set(metadataBytes, 4);
    combinedData.set(new Uint8Array(encrypted), 4 + metadataBytes.length);
    
    return {
        recoveryKey: recoveryKey,
        encryptedData: combinedData,
        originalFileName: file.name
    };
}

// Decryption process
async function startDecryption() {
    try {
        const password = document.getElementById('decrypt-password').value;
        const recoveryKey = document.getElementById('decrypt-recovery-key').value.trim();

        if (!password) {
            showNotification('Please enter your password', 'error');
            return;
        }

        if (!recoveryKey) {
            showNotification('Please enter your recovery key', 'error');
            return;
        }

        if (!selectedFile) {
            showNotification('No file selected', 'error');
            return;
        }

        // Show processing
        const form = document.getElementById('decrypt-form');
        const processing = document.getElementById('decrypt-processing');
        
        if (form) form.style.display = 'none';
        if (processing) processing.style.display = 'block';
        
        showProcessing('decrypt', 'Decrypting your file...');
        console.log('Starting decryption...');

        const encryptedData = await readFileAsArrayBuffer(selectedFile);
        const result = await decryptFile(encryptedData, password, recoveryKey);
        hideProcessing('decrypt');
        showDecryptResult(result);
        showNotification('File decrypted successfully!', 'success');
        console.log('Decryption completed successfully');
    } catch (error) {
        console.error('Decryption error:', error);
        showNotification('Decryption failed: ' + error.message, 'error');
        hideProcessing('decrypt');
    }
}

async function decryptFile(encryptedData, password, recoveryKey) {
    const dataArray = new Uint8Array(encryptedData);
    
    // Extract metadata
    const metadataLength = new Uint32Array(dataArray.buffer.slice(0, 4))[0];
    const metadataBytes = dataArray.slice(4, 4 + metadataLength);
    const metadata = JSON.parse(new TextDecoder().decode(metadataBytes));
    
    // Verify recovery key
    if (metadata.recoveryKey !== recoveryKey) {
        throw new Error('Invalid recovery key');
    }
    
    // Extract encrypted file data
    const encryptedFileData = dataArray.slice(4 + metadataLength);
    
    // Derive key and decrypt
    const salt = new Uint8Array(metadata.salt);
    const iv = new Uint8Array(metadata.iv);
    const key = await deriveKey(password, salt);
    
    const decrypted = await crypto.subtle.decrypt(
        { name: SECURITY_CONFIG.algorithm, iv: iv },
        key,
        encryptedFileData
    );
    
    return {
        data: decrypted,
        fileName: metadata.fileName,
        fileType: metadata.fileType,
        fileSize: metadata.fileSize
    };
}

// Cryptographic helper functions
async function deriveKey(password, salt) {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveBits', 'deriveKey']
    );
    
    return await crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: SECURITY_CONFIG.iterations,
            hash: 'SHA-256'
        },
        keyMaterial,
        { name: SECURITY_CONFIG.algorithm, length: SECURITY_CONFIG.keyLength },
        true,
        ['encrypt', 'decrypt']
    );
}

function generateRecoveryKey() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array));
}

// File I/O
function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsArrayBuffer(file);
    });
}

// CRITICAL FIX: Download system that ACTUALLY saves files to user's device
function downloadFile(data, filename, mimeType = 'application/octet-stream') {
    try {
        console.log('Starting download for:', filename);
        console.log('Data size:', data.byteLength || data.length);
        
        // Create blob from data
        const blob = new Blob([data], { type: mimeType });
        console.log('Blob created successfully, size:', blob.size);
        
        // Method 1: For IE/Edge (legacy support)
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            console.log('Using IE/Edge msSaveOrOpenBlob method');
            window.navigator.msSaveOrOpenBlob(blob, filename);
            return true;
        }
        
        // Method 2: Modern browsers - create download link
        console.log('Using modern download method');
        const url = URL.createObjectURL(blob);
        
        // Create a temporary link element
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        link.style.position = 'absolute';
        link.style.left = '-10000px';
        
        // Add to DOM, click, and remove
        document.body.appendChild(link);
        
        // Force the download by clicking the link
        link.click();
        
        // Clean up immediately
        setTimeout(() => {
            try {
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                console.log('Download cleanup completed');
            } catch (cleanupError) {
                console.warn('Cleanup warning:', cleanupError);
            }
        }, 100);
        
        console.log('Download initiated successfully');
        return true;
        
    } catch (error) {
        console.error('Download failed:', error);
        
        // Fallback method for problematic browsers
        console.log('Attempting fallback download method...');
        try {
            const blob = new Blob([data], { type: mimeType });
            const url = window.URL.createObjectURL(blob);
            
            // Open in new window as fallback
            const newWindow = window.open(url, '_blank');
            if (newWindow) {
                newWindow.document.title = filename;
                setTimeout(() => URL.revokeObjectURL(url), 1000);
                return true;
            }
        } catch (fallbackError) {
            console.error('Fallback download also failed:', fallbackError);
        }
        
        showNotification('Download failed: ' + error.message + '. Please try using a different browser.', 'error');
        return false;
    }
}

function downloadEncryptedFile() {
    try {
        console.log('Downloading encrypted file...');
        
        if (!encryptedFileData) {
            console.error('No encrypted file data available');
            showNotification('No encrypted file available for download', 'error');
            return;
        }
        
        if (!selectedFile) {
            console.error('No selected file information available');
            showNotification('File information not available', 'error');
            return;
        }
        
        const filename = selectedFile.name + '.encrypted';
        console.log('Encrypted file download - filename:', filename, 'size:', encryptedFileData.byteLength);
        
        const success = downloadFile(encryptedFileData, filename, 'application/octet-stream');
        
        if (success) {
            showNotification('Encrypted file download started successfully!', 'success');
        }
    } catch (error) {
        console.error('Error downloading encrypted file:', error);
        showNotification('Failed to download encrypted file: ' + error.message, 'error');
    }
}

function downloadDecryptedFile() {
    try {
        console.log('Downloading decrypted file...');
        
        if (!decryptedFileData) {
            console.error('No decrypted file data available');
            showNotification('No decrypted file available for download', 'error');
            return;
        }
        
        const filename = decryptedFileData.fileName;
        const mimeType = decryptedFileData.fileType || 'application/octet-stream';
        
        console.log('Decrypted file download - filename:', filename, 'type:', mimeType, 'size:', decryptedFileData.data.byteLength);
        
        const success = downloadFile(decryptedFileData.data, filename, mimeType);
        
        if (success) {
            showNotification('Original file download started successfully!', 'success');
        }
    } catch (error) {
        console.error('Error downloading decrypted file:', error);
        showNotification('Failed to download decrypted file: ' + error.message, 'error');
    }
}

// UI helper functions
function showProcessing(type, message) {
    try {
        const processing = document.getElementById(`${type}-processing`);
        const title = processing ? processing.querySelector('.processing-title') : null;
        const progressFill = document.getElementById(`${type}-progress`);
        
        if (title) title.textContent = message;
        if (processing) processing.style.display = 'block';
        
        if (progressFill) {
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 10;
                if (progress > 90) progress = 90;
                
                progressFill.style.width = progress + '%';
                
                if (progress >= 90) {
                    clearInterval(interval);
                }
            }, 100);
            
            if (processing) processing.dataset.intervalId = interval;
        }
    } catch (error) {
        console.error('Error showing processing:', error);
    }
}

function hideProcessing(type) {
    try {
        const processing = document.getElementById(`${type}-processing`);
        const intervalId = processing ? processing.dataset.intervalId : null;
        const progressFill = document.getElementById(`${type}-progress`);
        
        if (intervalId) {
            clearInterval(intervalId);
        }
        
        if (progressFill) {
            progressFill.style.width = '100%';
        }
        
        if (processing) {
            setTimeout(() => {
                processing.style.display = 'none';
            }, 500);
        }
    } catch (error) {
        console.error('Error hiding processing:', error);
    }
}

function showEncryptResult(result) {
    try {
        const recoveryKeyInput = document.getElementById('recovery-key');
        const resultDiv = document.getElementById('encrypt-result');
        
        if (recoveryKeyInput) recoveryKeyInput.value = result.recoveryKey;
        encryptedFileData = result.encryptedData;
        if (resultDiv) resultDiv.style.display = 'block';
        
        console.log('Encrypt result displayed');
    } catch (error) {
        console.error('Error showing encrypt result:', error);
    }
}

function showDecryptResult(result) {
    try {
        decryptedFileData = result;
        const resultDiv = document.getElementById('decrypt-result');
        if (resultDiv) resultDiv.style.display = 'block';
        
        console.log('Decrypt result displayed');
    } catch (error) {
        console.error('Error showing decrypt result:', error);
    }
}

function updatePasswordStrength() {
    try {
        const password = document.getElementById('encrypt-password').value;
        const strengthElement = document.getElementById('password-strength');
        
        if (!strengthElement) return;
        
        let strength = 0;
        let color = '#ef4444'; // Red
        
        if (password.length >= 8) strength += 25;
        if (password.match(/[a-z]/)) strength += 20;
        if (password.match(/[A-Z]/)) strength += 20;
        if (password.match(/[0-9]/)) strength += 20;
        if (password.match(/[^a-zA-Z0-9]/)) strength += 15;
        
        if (strength >= 80) color = '#22c55e'; // Green
        else if (strength >= 60) color = '#f59e0b'; // Yellow
        else if (strength >= 40) color = '#f97316'; // Orange
        
        strengthElement.style.setProperty('--strength-width', strength + '%');
        strengthElement.style.setProperty('--strength-color', color);
    } catch (error) {
        console.error('Error updating password strength:', error);
    }
}

// CRITICAL FIX: Robust clipboard functionality with fallbacks
function setupCopyButtons() {
    try {
        const copyButtons = document.querySelectorAll('.copy-button');
        console.log('Found', copyButtons.length, 'copy buttons');
        
        copyButtons.forEach((button, index) => {
            button.addEventListener('click', function(e) {
                console.log('Copy button', index, 'clicked');
                e.preventDefault();
                e.stopPropagation();
                
                const targetId = this.getAttribute('data-target');
                const input = document.getElementById(targetId);
                
                if (!input) {
                    console.warn('Copy target not found:', targetId);
                    return;
                }
                
                const text = input.value;
                copyToClipboard(text, this);
            });
        });
    } catch (error) {
        console.error('Error setting up copy buttons:', error);
    }
}

async function copyToClipboard(text, buttonElement) {
    try {
        console.log('Attempting to copy to clipboard...');
        
        // Try modern Clipboard API first
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            showNotification('Copied to clipboard!', 'success');
            showCopyFeedback(buttonElement);
            console.log('Copied using modern API');
            return true;
        }
        
        // Fallback method
        console.log('Using fallback copy method...');
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.top = '-1000px';
        textArea.style.left = '-1000px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showNotification('Copied to clipboard!', 'success');
                showCopyFeedback(buttonElement);
                console.log('Copied using fallback method');
                return true;
            }
        } catch (err) {
            console.error('Fallback copy failed:', err);
        } finally {
            document.body.removeChild(textArea);
        }
        
    } catch (error) {
        console.error('Copy failed:', error);
    }
    
    // Show manual copy option if all methods fail
    console.log('All copy methods failed, showing manual dialog');
    showManualCopyDialog(text);
    return false;
}

function showCopyFeedback(buttonElement) {
    if (!buttonElement) return;
    
    try {
        const originalText = buttonElement.textContent;
        buttonElement.textContent = 'Copied!';
        buttonElement.style.background = 'var(--color-success)';
        buttonElement.style.color = 'white';
        
        setTimeout(() => {
            buttonElement.textContent = originalText;
            buttonElement.style.background = '';
            buttonElement.style.color = '';
        }, 1500);
    } catch (error) {
        console.error('Error showing copy feedback:', error);
    }
}

function showManualCopyDialog(text) {
    try {
        const modal = document.getElementById('manual-copy-modal');
        const textArea = document.getElementById('manual-copy-text');
        
        if (modal && textArea) {
            textArea.value = text;
            modal.classList.remove('hidden');
            textArea.select();
            console.log('Manual copy dialog shown');
        }
    } catch (error) {
        console.error('Error showing manual copy dialog:', error);
    }
}

function setupModalHandlers() {
    try {
        const modal = document.getElementById('manual-copy-modal');
        const modalClose = document.getElementById('modal-close');
        const modalOverlay = document.getElementById('modal-overlay');
        
        if (modalClose) {
            modalClose.addEventListener('click', function() {
                if (modal) {
                    modal.classList.add('hidden');
                    console.log('Modal closed via button');
                }
            });
        }
        
        if (modalOverlay) {
            modalOverlay.addEventListener('click', function() {
                if (modal) {
                    modal.classList.add('hidden');
                    console.log('Modal closed via overlay');
                }
            });
        }
    } catch (error) {
        console.error('Error setting up modal handlers:', error);
    }
}

// CRITICAL FIX: Single notification system (no duplicates)
function showNotification(message, type = 'info') {
    try {
        const notification = document.getElementById('notification');
        if (!notification) {
            console.warn('Notification element not found');
            return;
        }
        
        // Clear any existing timeout
        if (currentNotificationTimeout) {
            clearTimeout(currentNotificationTimeout);
            currentNotificationTimeout = null;
        }
        
        // Update notification content and type
        notification.textContent = message;
        notification.className = `notification ${type}`;
        
        // Show notification
        notification.classList.remove('hidden');
        console.log('Notification shown:', message, type);
        
        // Auto-hide after 4 seconds
        currentNotificationTimeout = setTimeout(() => {
            notification.classList.add('hidden');
            currentNotificationTimeout = null;
            console.log('Notification auto-hidden');
        }, 4000);
    } catch (error) {
        console.error('Error showing notification:', error);
    }
}

// Form reset functions
function resetAllForms() {
    try {
        resetEncryptForm();
        resetDecryptForm();
        console.log('All forms reset');
    } catch (error) {
        console.error('Error resetting forms:', error);
    }
}

function resetEncryptForm() {
    try {
        selectedFile = null;
        encryptedFileData = null;
        
        // Reset form inputs
        const encryptFileInput = document.getElementById('encrypt-file-input');
        const encryptPassword = document.getElementById('encrypt-password');
        const encryptPasswordConfirm = document.getElementById('encrypt-password-confirm');
        
        if (encryptFileInput) encryptFileInput.value = '';
        if (encryptPassword) encryptPassword.value = '';
        if (encryptPasswordConfirm) encryptPasswordConfirm.value = '';
        
        // Reset UI state
        const uploadZone = document.getElementById('encrypt-upload-zone');
        const preview = document.getElementById('encrypt-file-preview');
        const step1 = document.getElementById('encrypt-step-1');
        const step2 = document.getElementById('encrypt-step-2');
        const step3 = document.getElementById('encrypt-step-3');
        const result = document.getElementById('encrypt-result');
        const processing = document.getElementById('encrypt-processing');
        
        if (uploadZone) uploadZone.style.display = 'block';
        if (preview) preview.style.display = 'none';
        if (step1) step1.style.display = 'block';
        if (step2) step2.style.display = 'none';
        if (step3) step3.style.display = 'none';
        if (result) result.style.display = 'none';
        if (processing) processing.style.display = 'none';
        
        // Reset password strength
        const strengthElement = document.getElementById('password-strength');
        if (strengthElement) {
            strengthElement.style.setProperty('--strength-width', '0%');
        }
        
        console.log('Encrypt form reset');
    } catch (error) {
        console.error('Error resetting encrypt form:', error);
    }
}

function resetDecryptForm() {
    try {
        selectedFile = null;
        decryptedFileData = null;
        
        // Reset form inputs
        const decryptFileInput = document.getElementById('decrypt-file-input');
        const decryptPassword = document.getElementById('decrypt-password');
        const decryptRecoveryKey = document.getElementById('decrypt-recovery-key');
        
        if (decryptFileInput) decryptFileInput.value = '';
        if (decryptPassword) decryptPassword.value = '';
        if (decryptRecoveryKey) decryptRecoveryKey.value = '';
        
        // Reset UI state
        const uploadZone = document.getElementById('decrypt-upload-zone');
        const preview = document.getElementById('decrypt-file-preview');
        const form = document.getElementById('decrypt-form');
        const processing = document.getElementById('decrypt-processing');
        const result = document.getElementById('decrypt-result');
        
        if (uploadZone) uploadZone.style.display = 'block';
        if (preview) preview.style.display = 'none';
        if (form) form.style.display = 'none';
        if (processing) processing.style.display = 'none';
        if (result) result.style.display = 'none';
        
        console.log('Decrypt form reset');
    } catch (error) {
        console.error('Error resetting decrypt form:', error);
    }
}