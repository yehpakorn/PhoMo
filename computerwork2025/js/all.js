//API SetUp
const url = `your_webhook_here`; // Replace with your actual webhook

// Global variables
let currentIdeas = [];
let selectedIdeaIndex = null;
let originalFormData = null;
let currentPage = 'form'; // 'form', 'results', or 'details'
let ideaDetailsData = null;

// Mobile menu toggle
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    
    navMenu.classList.toggle('mobile-open');
    hamburger.classList.toggle('active');
}

function startDesigning() {
    // Create a modal or redirect to design interface
    
    
    // You could also redirect to a design page:
    window.location.href = 'service.html';
}

// Close mobile menu when clicking on links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        const navMenu = document.querySelector('.nav-menu');
        const hamburger = document.querySelector('.hamburger');
        
        navMenu.classList.remove('mobile-open');
        hamburger.classList.remove('active');
    });
});

// Show/Hide pages
function showFormPage() {
    document.getElementById('formPage').classList.remove('hidden');
    document.getElementById('resultsPage').classList.remove('active');
    document.getElementById('detailsPage').classList.remove('active');
    currentPage = 'form';
}

function showResultsPage() {
    document.getElementById('formPage').classList.add('hidden');
    document.getElementById('resultsPage').classList.add('active');
    document.getElementById('detailsPage').classList.remove('active');
    currentPage = 'results';
}

function showDetailsPage() {
    document.getElementById('formPage').classList.add('hidden');
    document.getElementById('resultsPage').classList.remove('active');
    document.getElementById('detailsPage').classList.add('active');
    currentPage = 'details';
}

// Back to results from details
function backToResults() {
    showResultsPage();
}

// Form submission handler
document.getElementById('visionForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const continueBtn = document.getElementById('continueBtn');
    const buttonText = document.getElementById('buttonText');
    
    // Get form data
    const formData = {
        action: 'choose',
        scope: document.getElementById('scope').value,
        purpose: document.querySelector('input[name="purpose"]:checked')?.value || '',
        additional: document.getElementById('additional').value
    };
    
    // Validate required fields
    if (!formData.scope || !formData.purpose) {
        showNotification('Please fill in all required fields (Scope and Purpose)', 'error');
        return;
    }
    
    // Store original form data for reset functionality
    originalFormData = { ...formData };
    
    // Show loading state
    continueBtn.disabled = true;
    buttonText.innerHTML = '<div class="loading"></div>';
    
    try {
        // Make API call
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Success:', result);
        
        // Check if response has the expected structure
        if (result.status === 'ok' && result.action === 'choose' && result.ideas) {
            currentIdeas = result.ideas;
            renderIdeas();
            showResultsPage();
            showNotification('🎉 Ideas generated successfully!', 'success');
        } else {
            throw new Error('Invalid response format');
        }
        
    } catch (error) {
        console.error('Error:', error);
        
        // For demo purposes, use sample data if API fails
        console.log('Using sample data for demonstration...');
        
        const sampleResponse = {
            "status": "ok",
            "action": "choose",
            "ideas": [
                {
                    "title": "5 นาที เปลี่ยนชีวิต",
                    "explanation": "แนวคิดการใช้เวลาเพียง 5 นาทีต่อวันเพื่อพัฒนาตนเองในด้านต่างๆ เช่น การอ่าน หรือการกึกสติ.",
                    "development time": "น้อย"
                },
                {
                    "title": "บันทึกความสุข 3 ประโยค",
                    "explanation": "การจดบันทึกสิ่งดีๆ ที่เกิดขึ้นในแต่ละวันเพียง 3 ประโยคเพื่อเพิ่มความรู้สึกเชิงบวกอย่างง่ายดาย.",
                    "development time": "น้อย"
                },
                {
                    "title": "ทักษะใหม่ใน 30 วัน",
                    "explanation": "โปรแกรมท้าทายตนเองให้เรียนรู้หรือกึกทักษะใหม่ๆ เป็นเวลา 30 วันโดยเริ่มต้นจากพื้นฐานง่ายๆ.",
                    "development time": "น้อย"
                },
                {
                    "title": "พอดแคสต์สั้นสร้างแรงบันดาลใจ",
                    "explanation": "รวบรวมพอดแคสต์หรือคลิปเสียงสั้นๆ เกี่ยวกับการพัฒนาตนเองเพื่อฟังระหว่างทำกิจกรรมประจำวัน.",
                    "development time": "ปานกลาง"
                },
                {
                    "title": "คู่มือเป้าหมายส่วนตัวดิจิทัล",
                    "explanation": "ใช้แอปพลิเคชันหรือเครื่องมือดิจิทัลช่วยในการตั้งเป้าหมาย, จัดระเบียบความคิด, และติดตามความก้าวหน้าส่วนบุคคล.",
                    "development time": "ปานกลาง"
                }
            ]
        };
        
        currentIdeas = sampleResponse.ideas;
        renderIdeas();
        showResultsPage();
        showNotification('🎯 Demo ideas loaded! (API connection failed)', 'success');
        
    } finally {
        // Reset button state
        continueBtn.disabled = false;
        buttonText.textContent = 'Continue to design';
    }
});

// Render ideas in the grid
function renderIdeas() {
    const ideasGrid = document.getElementById('ideasGrid');
    const letters = ['A', 'B', 'C', 'D', 'E'];
    
    ideasGrid.innerHTML = '';
    
    // Render idea cards
    currentIdeas.forEach((idea, index) => {
        const ideaCard = document.createElement('div');
        ideaCard.className = 'idea-card';
        ideaCard.onclick = () => selectIdeaCard(index);
        
        ideaCard.innerHTML = `
            <div class="idea-letter">${letters[index]}</div>
            <h3 class="idea-title">${idea.title}</h3>
            <p class="idea-explanation">${idea.explanation}</p>
            <div class="idea-time">${idea['development time']}</div>
            <div class="radio-indicator"></div>
        `;
        
        ideasGrid.appendChild(ideaCard);
    });
    
    // Add generate more card
    const generateCard = document.createElement('div');
    generateCard.className = 'generate-more-card';
    generateCard.onclick = resetIdeas;
    
    generateCard.innerHTML = `
        <div class="plus-icon">+</div>
        <h3 class="generate-title">Needs more options?</h3>
        <p class="generate-subtitle">generate new set</p>
    `;
    
    ideasGrid.appendChild(generateCard);
}

// Select an idea card
function selectIdeaCard(index) {
    // Remove previous selection
    document.querySelectorAll('.idea-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Add selection to clicked card
    document.querySelectorAll('.idea-card')[index].classList.add('selected');
    
    selectedIdeaIndex = index;
    
    // Enable select button
    const selectButton = document.getElementById('selectButton');
    selectButton.disabled = false;
    selectButton.style.opacity = '1';
}

// Reset/Generate new ideas
async function resetIdeas() {
    if (!originalFormData) {
        showNotification('⚠ No original form data found. Please submit the form first.', 'error');
        return;
    }

    const resetButton = document.getElementById('resetButton');
    const resetText = document.getElementById('resetText');
    
    // Show loading state
    resetButton.disabled = true;
    resetText.innerHTML = '<div class="loading loading-dark"></div>';
    
    try {
        // Make API call with original form data
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(originalFormData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Reset Success:', result);
        
        if (result.status === 'ok' && result.action === 'choose' && result.ideas) {
            currentIdeas = result.ideas;
        } else {
            throw new Error('Invalid response format');
        }
        
    } catch (error) {
        console.error('Error generating new ideas:', error);
        
        // For demo, generate new sample ideas
        currentIdeas = generateNewIdeas();
        showNotification('🎯 New demo ideas generated! (API connection failed)', 'success');
    }
    
    // Clear selection
    selectedIdeaIndex = null;
    document.getElementById('selectButton').disabled = true;
    document.getElementById('selectButton').style.opacity = '0.5';
    
    // Re-render ideas
    renderIdeas();
    
    // Show success message if not already shown
    if (!error) {
        showNotification('🎉 New ideas generated successfully!', 'success');
    }
    
    // Reset button state
    resetButton.disabled = false;
    resetText.textContent = 'Generate new set';
}

// Select the chosen idea and proceed
async function selectIdea() {
    if (selectedIdeaIndex === null) {
        showNotification('⚠ Please select an idea first.', 'error');
        return;
    }
    
    const selectButton = document.getElementById('selectButton');
    const selectText = document.getElementById('selectText');
    const selectedIdea = currentIdeas[selectedIdeaIndex];
    
    // Show loading state
    selectButton.disabled = true;
    selectText.innerHTML = '<div class="loading"></div>';
    
    try {
        // Prepare data for API call
        const requestData = {
            action: 'explain',
            selectedIdea: selectedIdea.title,
            selectedDetail: selectedIdea.explanation
        };
        
        // Make API call
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Select Success:', result);
        
        // Store the details data and show details page
        ideaDetailsData = result;
        renderIdeaDetails(result);
        showDetailsPage();
        
        // Show success message
        showNotification('✅ Idea details loaded successfully!', 'success');
        
    } catch (error) {
        console.error('Error selecting idea:', error);
        
        // For demo purposes, use sample detailed data
        const sampleDetailsData = {
            "status": "ok",
            "action": "explain",
            "idea_innovation": selectedIdea.title,
            "explanation_of_idea_innovation": `นวัตกรรม "${selectedIdea.title}" เป็นแนวคิดที่มุ่งเน้นการพัฒนาตนเองอย่างยั่งยืน โดยใช้หลักการง่ายๆ ที่สามารถนำไปปฏิบัติได้ในชีวิตประจำวัน เพื่อสร้างการเปลี่ยนแปลงเชิงบวกและเพิ่มคุณภาพชีวิต`,
            "key_features": [
                {
                    "title": "ง่ายต่อการเริ่มต้น",
                    "explanation": "ไม่ต้องการเครื่องมือหรือความรู้พิเศษ สามารถเริ่มได้ทันทีด้วยสิ่งที่มีอยู่แล้ว"
                },
                {
                    "title": "ใช้เวลาน้อย",
                    "explanation": "ออกแบบให้ใช้เวลาไม่เกิน 5-10 นาทีต่อวัน เหมาะกับผู้ที่มีตารางเวลาแน่น"
                },
                {
                    "title": "ผลลัพธ์ที่วัดผลได้",
                    "explanation": "มีระบบติดตามความก้าวหน้าที่ชัดเจน ทำให้เห็นการเปลี่ยนแปลงได้อย่างเป็นรูปธรรม"
                }
            ],
            "how_to_make": [
                {
                    "step": 1,
                    "explanation": "วิเคราะห์ความต้องการและเป้าหมายส่วนบุคคลของผู้ใช้ เพื่อกำหนดทิศทางที่เหมาะสม"
                },
                {
                    "step": 2,
                    "explanation": "ออกแบบกิจกรรมและเครื่องมือที่ใช้งานง่าย มีความยืดหยุ่นสูง"
                },
                {
                    "step": 3,
                    "explanation": "สร้างระบบติดตามและประเมินผลที่ให้ข้อมูลป้อนกลับอย่างต่อเนื่อง"
                },
                {
                    "step": 4,
                    "explanation": "ทดสอบและปรับปรุงโปรแกรมตามผลตอบรับจากผู้ใช้จริง"
                }
            ],
            "development_method": {
                "research_ideation": "ศึกษาวิจัยเกี่ยวกับพฤติกรรมการเปลี่ยนแปลงและการพัฒนาตนเอง รวบรวมข้อมูลจากผู้เชี่ยวชาญและกลุ่มเป้าหมาย",
                "prototype_development": "สร้างต้นแบบกิจกรรมและเครื่องมือเบื้องต้น ทดสอบกับกลุ่มผู้ใช้น้อยจำนวน",
                "testing_validation": "ทดสอบประสิทธิภาพและความพึงพอใจกับกลุ่มผู้ใช้ขนาดใหญ่ขึ้น วิเคราะห์ผลลัพธ์และปรับปรุง",
                "launch_scale": "เปิดตัวสู่สาธารณะและขยายการให้บริการ พัฒนาฟีเจอร์เพิ่มเติมตามความต้องการผู้ใช้"
            }
        };
        
        ideaDetailsData = sampleDetailsData;
        renderIdeaDetails(sampleDetailsData);
        showDetailsPage();
        showNotification('🎯 Demo idea details loaded!', 'success');
        
    } finally {
        // Reset button state
        selectButton.disabled = false;
        selectText.textContent = 'Select this idea';
    }
}
// Render idea details page
function renderIdeaDetails(data) {
    //format text for HTML display
    function formatText(text) {
        if (!text) return '';
        // Replace **Text** with <strong>Text</strong> for bolding
        let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Replace newlines with <br> for line breaks
        formattedText = formattedText.replace(/\n/g, '<br>');
        return formattedText;
    }
    // Update innovation title and explanation
    document.getElementById('innovationTitle').textContent = data.ideas.idea || 'Innovation Title';
    document.getElementById('innovationExplanation').textContent = formatText(data.ideas.explanation) || 'Innovation explanation...';
    
    // Render key features
    const featuresGrid = document.getElementById('featuresGrid');
    featuresGrid.innerHTML = '';
    
    if (data.ideas.key_features && Array.isArray(data.ideas.key_features)) {
        data.ideas.key_features.forEach((feature, index) => {
            const featureCard = document.createElement('div');
            featureCard.className = 'feature-card';
            featureCard.innerHTML = `
                <div class="feature-number">${index + 1}</div>
                <h3 class="feature-title">${feature.title || `Key feature ${index + 1}`}</h3>
                <p class="feature-description">${feature.explanation || 'Feature explanation...'}</p>
            `;
            featuresGrid.appendChild(featureCard);
        });
    }
    
    // Render how to make steps
    const stepsList = document.getElementById('stepsList');
    stepsList.innerHTML = '';
    
    if (data.ideas.how_to_make && Array.isArray(data.ideas.how_to_make)) {
        data.ideas.how_to_make.forEach((step, index) => {
            const stepItem = document.createElement('div');
            stepItem.className = 'step-item';
            stepItem.innerHTML = `
                <div class="step-number">${index + 1}</div>
                <div class="step-content">
                    <h3 class="step-title">${step.title || index + 1}</h3>
                    <p class="step-description">${step.explanation || 'Step explanation...'}</p>
                </div>
            `;
            stepsList.appendChild(stepItem);
        });
    }
    
    // Update development method descriptions
    if (data.ideas.development_method) {
        document.getElementById('researchDesc').textContent = data.ideas.development_method.research_ideation || 'Research and ideation phase description...';
        document.getElementById('prototypeDesc').textContent = data.ideas.development_method.prototype_development || 'Prototype development phase description...';
        document.getElementById('testingDesc').textContent = data.ideas.development_method.testing_validation || 'Testing and validation phase description...';
        document.getElementById('launchDesc').textContent = data.ideas.development_method.launch_scale || 'Launch and scale phase description...';
    }

    
}

// Generate new ideas (demo function)
function generateNewIdeas() {
    const newIdeasSets = [
        [
            {
                "title": "ออกกำลังกาย 15 นาที",
                "explanation": "แนวคิดการออกกำลังกายแบบง่ายๆ ที่ทำได้ที่บ้าน เพียง 15 นาทีต่อวันเพื่อสุขภาพที่ดีขึ้น.",
                "development time": "น้อย"
            },
            {
                "title": "อ่านหนังสือ 1 หน้าต่อวัน",
                "explanation": "การสร้างนิสัยการอ่านด้วยการเริ่มต้นจากการอ่านเพียง 1 หน้าต่อวัน เพื่อเพิ่มความรู้และพัฒนาตนเองอย่างค่อยเป็นค่อยไป.",
                "development time": "น้อย"
            },
            {
                "title": "เรียนภาษาใหม่ 10 นาทีต่อวัน",
                "explanation": "การเรียนรู้ภาษาใหม่ด้วยการกึกทุกวันเพียงวันละ 10 นาที ผ่านแอปพลิเคชันหรือบทเรียนออนไลน์.",
                "development time": "น้อย"
            },
            {
                "title": "สมาธิและจิตตารมณ์",
                "explanation": "การกึกสมาธิและการจัดการอารมณ์ด้วยเทคนิคง่ายๆ ที่สามารถทำได้ทุกที่ทุกเวลา เพื่อความสงบและมีสติ.",
                "development time": "ปานกลาง"
            },
            {
                "title": "โครงการประหยัดเงินสมาร์ท",
                "explanation": "การสร้างแผนการออมเงินและการจัดการการเงินส่วนบุคคลด้วยเครื่องมือดิจิทัลและเทคนิคการประหยัดที่ทันสมัย.",
                "development time": "ปานกลาง"
            }
        ],
        [
            {
                "title": "สวนผักในบ้าน",
                "explanation": "การปลูกผักและสมุนไพรเบื้องต้นในพื้นที่จำกัด เพื่อการบริโภคในครัวเรือนและประหยัดค่าใช้จ่าย.",
                "development time": "น้อย"
            },
            {
                "title": "ทำความสะอาดแบบมินิมอล",
                "explanation": "เทคนิคการจัดระเบียบและทำความสะอาดบ้านแบบง่ายๆ ที่ไม่ใช้เวลามาก แต่ได้ผลลัพธ์ที่ดี.",
                "development time": "น้อย"
            },
            {
                "title": "เรียนรู้ใหม่ทุกสัปดาห์",
                "explanation": "การตั้งเป้าหมายเรียนรู้สิ่งใหม่อย่างน้อยหนึ่งอย่างทุกสัปดาห์ เพื่อขยายขอบเขตความรู้และความสามารถ.",
                "development time": "ปานกลาง"
            },
            {
                "title": "โครงการลดขยะในบ้าน",
                "explanation": "การวางแผนและปฏิบัติเพื่อลดปริมาณขยะในครัวเรือน ผ่านการนำกลับมาใช้ใหม่และการรีไซเคิล.",
                "development time": "ปานกลาง"
            },
            {
                "title": "สร้างเครือข่ายชุมชน",
                "explanation": "การสร้างและพัฒนาเครือข่ายในชุมชนเพื่อแลกเปลี่ยนความรู้ ทักษะ และช่วยเหลือซึ่งกันและกัน.",
                "development time": "มาก"
            }
        ]
    ];
    
    // Return random set
    const randomIndex = Math.floor(Math.random() * newIdeasSets.length);
    return newIdeasSets[randomIndex];
}

// Show notification message
function showNotification(message, type = 'info') {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Form validation and interaction improvements
document.addEventListener('DOMContentLoaded', function() {
    const scopeInput = document.getElementById('scope');
    const purposeRadios = document.querySelectorAll('input[name="purpose"]');
    const additionalTextarea = document.getElementById('additional');
    
    // Real-time validation feedback
    function validateForm() {
        const hasScope = scopeInput.value.trim().length > 0;
        const hasPurpose = document.querySelector('input[name="purpose"]:checked') !== null;
        const continueBtn = document.getElementById('continueBtn');
        
        if (hasScope && hasPurpose) {
            continueBtn.style.opacity = '1';
            continueBtn.disabled = false;
        } else {
            continueBtn.style.opacity = '0.6';
            continueBtn.disabled = true;
        }
    }
    
    // Add event listeners
    scopeInput.addEventListener('input', validateForm);
    purposeRadios.forEach(radio => {
        radio.addEventListener('change', validateForm);
    });
    
    // Initial validation
    validateForm();
    
    // Character counter for additional requirements
    additionalTextarea.addEventListener('input', function() {
        const maxLength = 500;
        const currentLength = this.value.length;
        console.log(`Characters: ${currentLength}/${maxLength}`);
    });
});

// Keyboard navigation support
document.addEventListener('keydown', function(event) {
    if (currentPage === 'results') {
        if (event.key === 'Enter' && selectedIdeaIndex !== null) {
            selectIdea();
        } else if (event.key === 'Escape') {
            // Clear selection
            document.querySelectorAll('.idea-card').forEach(card => {
                card.classList.remove('selected');
            });
            selectedIdeaIndex = null;
            document.getElementById('selectButton').disabled = true;
            document.getElementById('selectButton').style.opacity = '0.5';
        }
    } else if (currentPage === 'details') {
        if (event.key === 'Escape') {
            backToResults();
        }
    }
});

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.step').forEach(step => {
        step.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        step.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    showFormPage();
});