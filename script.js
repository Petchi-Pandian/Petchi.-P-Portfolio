/**
 * Petchi P - Power Platform Developer Portfolio
 * Master Interactive Logic & UX Enhancements
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Navigation Header Scroll Effect & Active Link ScrollSpy
  // --------------------------------------------------------------------------
  const navHeader = document.getElementById('nav-header');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const sections = document.querySelectorAll('main > section');

  function handleNavScroll() {
    if (window.scrollY > 30) {
      navHeader.classList.add('scrolled');
    } else {
      navHeader.classList.remove('scrolled');
    }

    // ScrollSpy active link detection
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 160;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('data-nav') === currentSectionId) {
          link.classList.add('active');
        }
      });
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // --------------------------------------------------------------------------
  // 2. Mobile Menu Drawer
  // --------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileCloseLinks = document.querySelectorAll('[data-close-menu]');

  function toggleMobileMenu() {
    const isOpen = mobileMenu.classList.contains('open');
    if (isOpen) {
      mobileMenu.classList.remove('open');
      mobileToggle.classList.remove('active');
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    } else {
      mobileMenu.classList.add('open');
      mobileToggle.classList.add('active');
      mobileToggle.setAttribute('aria-expanded', 'true');
      mobileMenu.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', toggleMobileMenu);

    mobileCloseLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (mobileMenu.classList.contains('open')) {
          toggleMobileMenu();
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 3. Resume Download Dropdown
  // --------------------------------------------------------------------------
  const resumeDropdownBtn = document.getElementById('resumeDropdownBtn');
  const resumeDropdownWrapper = document.querySelector('.resume-dropdown-wrapper');

  if (resumeDropdownBtn && resumeDropdownWrapper) {
    resumeDropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = resumeDropdownWrapper.classList.contains('open');
      resumeDropdownWrapper.classList.toggle('open', !isOpen);
      resumeDropdownBtn.setAttribute('aria-expanded', !isOpen);
    });

    document.addEventListener('click', (e) => {
      if (!resumeDropdownWrapper.contains(e.target)) {
        resumeDropdownWrapper.classList.remove('open');
        resumeDropdownBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4. Hero Photo Comparison Switcher (AI Enhanced vs Authentic Reference)
  // --------------------------------------------------------------------------
  const btnTogglePhoto = document.getElementById('btnTogglePhoto');
  const heroCardFrame = document.querySelector('.hero-card-frame');
  const photoToggleLabel = document.getElementById('photoToggleLabel');

  if (btnTogglePhoto && heroCardFrame) {
    btnTogglePhoto.addEventListener('click', () => {
      const isShowingSource = heroCardFrame.classList.contains('show-source');
      if (isShowingSource) {
        heroCardFrame.classList.remove('show-source');
        if (photoToggleLabel) photoToggleLabel.textContent = 'AI-Enhanced Portrait';
        showToast('Viewing: AI-Enhanced Studio Portrait');
      } else {
        heroCardFrame.classList.add('show-source');
        if (photoToggleLabel) photoToggleLabel.textContent = 'Original Photo Reference';
        showToast('Viewing: Authentic Reference Photo');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 5. About Section Photo Strip Switcher (Studio AI, Executive AI, Workstation)
  // --------------------------------------------------------------------------
  const aboutMainImg = document.getElementById('aboutMainImg');
  const thumbStudio = document.getElementById('thumbStudio');
  const thumbExecutive = document.getElementById('thumbExecutive');
  const thumbWorkstation = document.getElementById('thumbWorkstation');
  const thumbs = [thumbStudio, thumbExecutive, thumbWorkstation];

  function setAboutPhoto(imgSrc, activeThumb, label) {
    if (!aboutMainImg) return;
    aboutMainImg.style.opacity = '0';
    setTimeout(() => {
      aboutMainImg.src = imgSrc;
      aboutMainImg.style.opacity = '1';
    }, 200);

    thumbs.forEach((t) => t && t.classList.remove('active'));
    if (activeThumb) activeThumb.classList.add('active');
    showToast(`Viewing: ${label}`);
  }

  if (thumbStudio) {
    thumbStudio.addEventListener('click', () => {
      setAboutPhoto('assets/images/about-portrait.jpg', thumbStudio, 'Studio AI Portrait');
    });
  }
  if (thumbExecutive) {
    thumbExecutive.addEventListener('click', () => {
      setAboutPhoto('assets/images/hero-portrait.jpg', thumbExecutive, 'Executive AI Portrait');
    });
  }
  if (thumbWorkstation) {
    thumbWorkstation.addEventListener('click', () => {
      setAboutPhoto('assets/images/original-developer-screen.jpg', thumbWorkstation, 'Veelead Office Workstation');
    });
  }

  // --------------------------------------------------------------------------
  // 6. Skills Category Filtering
  // --------------------------------------------------------------------------
  const skillFilterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  skillFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      skillFilterBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterValue = btn.getAttribute('data-filter');

      skillCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || cardCategory.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 7. Projects Category Filtering
  // --------------------------------------------------------------------------
  const projectFilterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  projectFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      projectFilterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const cat = card.getAttribute('data-category') || '';
        if (filterVal === 'all' || cat === filterVal) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 8. Project Detail Modal Data & Logic
  // --------------------------------------------------------------------------
  const projectData = {
    'perf-mgmt': {
      title: 'Performance Management System',
      category: 'Human Resources & Governance',
      image: 'assets/projects/project-perf-mgmt.jpg',
      badge: 'AI Conceptual Visual',
      tech: ['Power Apps Canvas', 'Power Automate', 'SharePoint Online', 'Business Rules', 'Role-Based Access'],
      problem:
        'The enterprise client relied on fragmented manual spreadsheets and disparate email chains to manage annual employee goal setting, mid-year check-ins, and final performance ratings. This lack of structure resulted in lost evaluations, no audit trail, and zero executive visibility into organizational talent metrics.',
      solution:
        'Architected a multi-screen Canvas Application integrated with SharePoint Online and Power Automate cloud flows. The solution establishes an end-to-end evaluation lifecycle covering initial goal alignment, competency rating matrix, 360-degree feedback, multi-level management reviews, and executive score lock.',
      contribution: [
        'Engineered responsive multi-screen Canvas App with role-based security filters (Employee, Appraiser, Reviewer, HR Admin).',
        'Implemented dynamic formula calculations for competency score weighting and rating tier calibrations.',
        'Designed Power Automate cloud flows for automated deadline notifications, manager escalation reminders, and approval status broadcasts.',
        'Managed successful UAT cycles with enterprise HR stakeholders, resolved defect backlogs, and packaged production ALM solutions.'
      ]
    },
    'approval-mgmt': {
      title: 'Purchase Order / Approval Management System',
      category: 'Finance & Procurement Automation',
      image: 'assets/projects/project-approval-flow.jpg',
      badge: 'AI Conceptual Visual',
      tech: ['Power Apps', 'Power Automate', 'SharePoint Online', 'Conditional Routing', 'Email Approvals'],
      problem:
        'Procurement requisitions suffered from delayed turnaround times, lack of authorization threshold validation, and untracked paper purchase requests. Finance managers lacked real-time visibility into pending commitments against quarterly department budgets.',
      solution:
        'Developed an automated requisition submission portal in Power Apps coupled with an intelligent multi-stage approval engine in Power Automate. The system routes approval cards dynamically based on department code, item category, and financial expenditure thresholds.',
      contribution: [
        'Built dynamic requisition forms with real-time budget verification and file attachment handling for vendor quotes.',
        'Constructed sequential and parallel approval branches with conditional timeouts and auto-delegation when managers are out of office.',
        'Integrated Outlook actionable messages allowing executives to approve or reject requisitions directly from their email inbox.',
        'Enforced strict status management (Draft, Submitted, Under Review, Approved, PO Issued, Closed) with complete audit trail.'
      ]
    },
    'spfx-portals': {
      title: 'SPFx Applications — Leave, Lunch & HR Portals',
      category: 'SharePoint Modern Framework Development',
      image: 'assets/projects/project-spfx-portal.jpg',
      badge: 'AI Conceptual Visual',
      tech: ['SPFx', 'React.js', 'TypeScript', 'Microsoft Graph API', 'SharePoint Online REST API'],
      problem:
        'Standard SharePoint list interfaces felt clunky and unintuitive for daily employee interactions like submitting leave requests, browsing cafeteria menus, and checking company policy bulletins, reducing employee intranet adoption.',
      solution:
        'Engineered modern, responsive SharePoint Framework (SPFx) client-side web parts utilizing React and TypeScript. Delivered clean employee self-service widgets directly embedded into the corporate intranet homepage.',
      contribution: [
        'Developed reusable React component libraries for leave balance gauges, interactive calendar pickers, and meal reservation modules.',
        'Implemented strict TypeScript typing and asynchronous REST API handlers to fetch SharePoint Online data with sub-second latency.',
        'Leveraged Microsoft Graph API for current user profile data, direct manager lookups, and Azure AD group role verification.',
        'Maintained full compatibility with modern SharePoint page layouts across desktop, tablet, and mobile browsers.'
      ]
    },
    'powerbi-enrollment': {
      title: 'Student Enrollment & Trend Dashboard',
      category: 'Business Intelligence & Academic Analytics',
      image: 'assets/projects/project-powerbi-dash.svg',
      badge: 'Conceptual Vector Graphic',
      tech: ['Power BI', 'DAX Measures', 'Data Modeling', 'Power Query', 'Interactive Telemetry'],
      problem:
        'Academic admissions leadership lacked a unified tool to analyze year-over-year enrollment trends, regional student demographics, departmental intake distribution, and retention rates across academic cycles.',
      solution:
        'Created a rich, interactive Power BI business intelligence dashboard that aggregates historical and current enrollment datasets into dynamic executive visual charts, KPI metric cards, and geographic distribution heatmaps.',
      contribution: [
        'Designed relational data models connecting applicant intake records, course catalogs, and demographic data sources.',
        'Engineered custom DAX measures for year-over-year growth rate (YoY), retention percentages, and projected capacity utilization.',
        'Configured interactive slicers, cross-filtering charts, and drill-through pages for granular department-level inspections.',
        'Optimized data queries in Power Query for rapid dashboard refresh cycles and lightweight web rendering.'
      ]
    },
    'vendor-hr': {
      title: 'Vendor & HR Management Applications',
      category: 'Enterprise Compliance & Operations',
      image: 'assets/projects/project-vendor-hr.svg',
      badge: 'Conceptual Vector Graphic',
      tech: ['Power Apps', 'Power Automate', 'SharePoint Online', 'Data Validation', 'Document Checklists'],
      problem:
        'Vendor onboarding and employee lifecycle management involved manual document collection, high risk of missing statutory certificates, and uncoordinated handoffs between procurement, legal, and HR departments.',
      solution:
        'Delivered a unified portal application covering vendor dossier registration, KYC validation, ISO compliance checks, NDA execution, and employee onboarding handoffs with automated trigger alerts.',
      contribution: [
        'Designed structured multi-step forms in Power Apps with strict regex validation for statutory tax IDs, banking credentials, and license numbers.',
        'Built automated Power Automate cloud flows to verify checklist completeness before advancing vendors to legal review stages.',
        'Integrated SharePoint secure document repositories with granular permission inheritance to protect sensitive commercial contracts.',
        'Automated welcome kit dispatches, IT asset allocation requests, and credential provisioning notifications.'
      ]
    },
    'helpdesk': {
      title: 'Help Desk & Issue Tracking System',
      category: 'IT Service Management & Ticketing',
      image: 'assets/projects/project-helpdesk.svg',
      badge: 'Conceptual Vector Graphic',
      tech: ['Power Apps Canvas', 'Power Automate', 'SharePoint Lists', 'SLA Monitoring', 'Teams Webhooks'],
      problem:
        'Internal IT and operational support requests submitted via email and chat were frequently lost, lacked priority classification, and had no measurable service level agreement (SLA) response tracking.',
      solution:
        'Built a centralized ticket management Canvas Application with automated ticket dispatch, SLA status timers, technician assignment pipelines, and real-time email notifications for support teams.',
      contribution: [
        'Engineered an intuitive ticket submission screen with auto-populated user details, category categorization, and screenshot attachment support.',
        'Implemented automated priority assignment rules (P1 Critical through P3 Normal) based on business impact and urgency.',
        'Configured Power Automate cloud flows that monitor ticket resolution deadlines, alerting leads when tickets near SLA breach.',
        'Developed a Kanban-style triage board for support technicians with real-time status updates and resolution notes logging.'
      ]
    }
  };

  const projectModal = document.getElementById('projectModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalImg = document.getElementById('modalImg');
  const modalBadge = document.getElementById('modalBadge');
  const modalCat = document.getElementById('modalCat');
  const modalTitle = document.getElementById('modalTitle');
  const modalTechStack = document.getElementById('modalTechStack');
  const modalProblem = document.getElementById('modalProblem');
  const modalSolution = document.getElementById('modalSolution');
  const modalContribution = document.getElementById('modalContribution');

  function openProjectModal(projectId) {
    const data = projectData[projectId];
    if (!data || !projectModal) return;

    modalImg.src = data.image;
    modalImg.alt = data.title;
    modalBadge.textContent = data.badge;
    modalCat.textContent = data.category;
    modalTitle.textContent = data.title;
    modalProblem.textContent = data.problem;
    modalSolution.textContent = data.solution;

    // Render tech stack tags
    modalTechStack.innerHTML = '';
    data.tech.forEach((t) => {
      const span = document.createElement('span');
      span.textContent = t;
      modalTechStack.appendChild(span);
    });

    // Render contribution bullets
    modalContribution.innerHTML = '';
    data.contribution.forEach((c) => {
      const li = document.createElement('li');
      li.textContent = c;
      modalContribution.appendChild(li);
    });

    projectModal.classList.add('open');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.remove('open');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Open modal buttons
  document.querySelectorAll('.open-modal-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const projId = btn.getAttribute('data-project');
      openProjectModal(projId);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
  }

  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        closeProjectModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal && projectModal.classList.contains('open')) {
      closeProjectModal();
    }
  });

  // --------------------------------------------------------------------------
  // 9. Copy Email to Clipboard
  // --------------------------------------------------------------------------
  const btnCopyEmail = document.getElementById('btnCopyEmail');
  const copyEmailText = document.getElementById('copyEmailText');

  if (btnCopyEmail) {
    btnCopyEmail.addEventListener('click', () => {
      const email = 'preamk007@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        if (copyEmailText) copyEmailText.textContent = 'Copied!';
        showToast('Email address copied to clipboard: preamk007@gmail.com');
        setTimeout(() => {
          if (copyEmailText) copyEmailText.textContent = 'Copy';
        }, 3000);
      }).catch(() => {
        showToast('Please copy: preamk007@gmail.com');
      });
    });
  }

  // --------------------------------------------------------------------------
  // 10. Contact Form Mailto Handler
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('senderName').value.trim();
      const email = document.getElementById('senderEmail').value.trim();
      const subject = document.getElementById('senderSubject').value.trim();
      const message = document.getElementById('senderMessage').value.trim();

      if (!name || !email || !message) {
        showToast('Please complete all required fields.');
        return;
      }

      const emailSubject = encodeURIComponent(`[Portfolio Inquiry] ${subject} - from ${name}`);
      const emailBody = encodeURIComponent(
        `Hi Petchi,\n\n${message}\n\n---\nSender Details:\nName: ${name}\nEmail: ${email}\nSent via Portfolio Contact Form`
      );

      const mailtoUrl = `mailto:preamk007@gmail.com?subject=${emailSubject}&body=${emailBody}`;

      showToast('Opening your default email client to send message...');
      window.location.href = mailtoUrl;
    });
  }

  // --------------------------------------------------------------------------
  // 11. Toast Notification Utility
  // --------------------------------------------------------------------------
  let toastTimer = null;
  const siteToast = document.getElementById('siteToast');
  const toastMessage = document.getElementById('toastMessage');

  function showToast(msg) {
    if (!siteToast || !toastMessage) return;
    toastMessage.textContent = msg;
    siteToast.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      siteToast.classList.remove('show');
    }, 4000);
  }

  // --------------------------------------------------------------------------
  // 12. IntersectionObserver Reveal Animation
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting || entry.intersectionRatio > 0.1) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach((el) => el.classList.add('active'));
  }

  // --------------------------------------------------------------------------
  // 13. Dynamic Year in Footer
  // --------------------------------------------------------------------------
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }
});
