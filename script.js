/**
 * EDAV Project Presentation Layer — Interactive Vanilla JavaScript
 * Handles Navigation, Theme Toggle, Count-up Animations, Accordions, Lightbox, and Methodology Timeline.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. THEME TOGGLE (Dark / Light Mode)
     ========================================================================== */
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;

  // Retrieve saved theme or default to dark
  const savedTheme = localStorage.getItem('edav_theme') || 'dark';
  if (savedTheme === 'light') {
    body.classList.remove('dark-theme');
    body.classList.add('light-theme');
  } else {
    body.classList.remove('light-theme');
    body.classList.add('dark-theme');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = body.classList.contains('dark-theme');
      if (isDark) {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        localStorage.setItem('edav_theme', 'light');
      } else {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        localStorage.setItem('edav_theme', 'dark');
      }
    });
  }

  /* ==========================================================================
     2. MOBILE MENU DRAWER
     ========================================================================== */
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      mobileNav.classList.toggle('open');
      mobileNav.setAttribute('aria-hidden', isExpanded);
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileNav.classList.remove('open');
        mobileNav.setAttribute('aria-hidden', 'true');
      });
    });
  }

  /* ==========================================================================
     3. STICKY NAVBAR & ACTIVE SECTION SCROLL SPY
     ========================================================================== */
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const sections = document.querySelectorAll('section[id], aside[id]');

  function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 140;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  /* ==========================================================================
     4. COUNT-UP NUMBER ANIMATION (IntersectionObserver)
     ========================================================================== */
  const countUpElements = document.querySelectorAll('.count-up');

  function animateCount(el) {
    const target = parseFloat(el.getAttribute('data-target'));
    const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    const duration = 1600; // ms
    const startTime = performance.now();

    function updateNumber(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out quad function: progress * (2 - progress)
      const easeProgress = progress * (2 - progress);
      const currentVal = target * easeProgress;

      if (decimals > 0) {
        el.textContent = currentVal.toFixed(decimals);
      } else {
        el.textContent = Math.floor(currentVal).toLocaleString();
      }

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      } else {
        if (decimals > 0) {
          el.textContent = target.toFixed(decimals);
        } else {
          el.textContent = target.toLocaleString();
        }
      }
    }

    requestAnimationFrame(updateNumber);
  }

  if ('IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          animateCount(el);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.25 });

    countUpElements.forEach(el => statsObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver not available
    countUpElements.forEach(el => {
      const target = parseFloat(el.getAttribute('data-target'));
      const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      el.textContent = decimals > 0 ? target.toFixed(decimals) : target.toLocaleString();
    });
  }

  /* ==========================================================================
     5. FIVE QUESTIONS ACCORDION
     ========================================================================== */
  const questionHeaders = document.querySelectorAll('.question-header');

  questionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const card = header.closest('.question-card');
      const isExpanded = header.getAttribute('aria-expanded') === 'true';

      // Toggle current card
      header.setAttribute('aria-expanded', !isExpanded);
      card.classList.toggle('active');

      // Update button text
      const btnSpan = header.querySelector('.view-answer-btn span');
      if (btnSpan) {
        btnSpan.textContent = card.classList.contains('active') ? 'Collapse Answer ↑' : 'View Answer →';
      }

      renderAllMath();
    });

    // Keyboard navigation (Enter or Space)
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        header.click();
      }
    });
  });

  /* ==========================================================================
     6. METHODOLOGY TIMELINE INTERACTION
     ========================================================================== */
  const methodologySteps = [
    {
      num: '01',
      badge: 'Step 01 of 08',
      name: 'Load Dataset',
      op: 'pd.read_csv()',
      purpose: 'Read college_accreditation_synthetic.csv into an in-memory pandas DataFrame. Configure display parameters to prevent truncation and establish seaborn aesthetics.',
      impact: 'Constructs the primary DataFrame df with shape (7000, 9). Memory footprint confirmed at 492.3 KB.',
      code: `df = pd.read_csv("college_accreditation_synthetic.csv")
print("Dimensions:", df.shape)  # (7000, 9)
print("Type:", type(df))`
    },
    {
      num: '02',
      badge: 'Step 02 of 08',
      name: 'Initial Inspection',
      op: 'head(), info(), describe()',
      purpose: 'Verify column names, inspect the first and last 5 records, check non-null counts, and establish basic data types across all 9 fields.',
      impact: 'Confirmed College_ID uniqueness (7,000 distinct IDs), identified 3 float columns and 6 text string columns.',
      code: `df.head()
df.info()
df.describe(include="all")`
    },
    {
      num: '03',
      badge: 'Step 03 of 08',
      name: 'Data Quality & Duplicate Audit',
      op: 'isna().sum(), duplicated().sum()',
      purpose: 'Count missing values per column and test for duplicate rows to prevent artificial count inflation.',
      impact: 'Confirmed exactly 0 duplicate rows. Identified missingness: Rating (866, 12.37%), Grade (608, 8.69%), State (175, 2.50%), Region (176, 2.51%).',
      code: `missing_count = df.isnull().sum()
duplicate_count = int(df.duplicated().sum())  # 0
print(missing_count)`
    },
    {
      num: '04',
      badge: 'Step 04 of 08',
      name: 'Status Proportion Analysis (Q1)',
      op: 'value_counts(), normalize',
      purpose: 'Formulate the percentage of accredited colleges over total N=7,000, and evaluate the complete 3-category partition.',
      impact: 'Solved Q1: 4,694 Accredited (67.06%), 1,566 Not Accredited (22.37%), 740 Under Review (10.57%). Status has zero nulls.',
      code: `total = len(df)
n_acc = (df["Accreditation_Status"] == "Accredited").sum()
pct_acc = (n_acc / total) * 100  # 67.06%`
    },
    {
      num: '05',
      badge: 'Step 05 of 08',
      name: 'Boolean Indexing & Regional Filtering (Q2)',
      op: 'Boolean Masking (&)',
      purpose: 'Extract regional subsets meeting concurrent criteria using bitwise logical AND (&) without modifying the original table.',
      impact: 'Solved Q2: Accredited ∩ South = 1,619; Not Accredited ∩ North = 424; Under Review ∩ West = 112. Rows missing Region (176) cleanly excluded.',
      code: `accredited_south = df[
    (df["Accreditation_Status"] == "Accredited") &
    (df["Region"] == "South")
]  # len: 1619`
    },
    {
      num: '06',
      badge: 'Step 06 of 08',
      name: 'Two-Stage Imputation (Q3)',
      op: 'groupby().median(), fillna()',
      purpose: 'Diagnose 866 missing ratings and apply a principled group-wise median imputation to prevent mean skew or artificial zero spikes.',
      impact: 'Solved Q3: Stage 1 (Grade median) resolved 737 values. Stage 2 (Status median) resolved remaining 129 values. Missing ratings: 866 -> 0.',
      code: `grade_med = df.groupby("Accreditation_Grade")[col].median()
status_med = df.groupby("Accreditation_Status")[col].median()
df[col] = df[col].fillna(df["Accreditation_Grade"].map(grade_med))
df[col] = df[col].fillna(df["Accreditation_Status"].map(status_med))`
    },
    {
      num: '07',
      badge: 'Step 07 of 08',
      name: 'Multi-Index Grouping & Cross-tabulation (Q4)',
      op: 'groupby([State, Grade]).size()',
      purpose: 'Partition the dataset across State and Grade dimensions, counting rows in each combination and reshaping via unstack().',
      impact: 'Solved Q4: 263 observed (State, Grade) groups. Top combinations: Karnataka A+ (120), Karnataka A (116), Maharashtra A (114), Maharashtra A+ (111).',
      code: `state_grade = (
    df.groupby(["State", "Accreditation_Grade"])
      .size().reset_index(name="College_Count")
      .sort_values("College_Count", ascending=False)
)`
    },
    {
      num: '08',
      badge: 'Step 08 of 08',
      name: 'Geographic Visualization Synthesis (Q5)',
      op: 'sns.barplot(), heatmap()',
      purpose: 'Construct three complementary figures: sorted horizontal bar chart (36 states), stacked composition bar (top 15), and 2D frequency heatmap (top 12).',
      impact: 'Solved Q5: Visually demonstrated high accredited counts in Maharashtra (467) & Karnataka (435); verified Accredited dominance across all top states.',
      code: `sns.barplot(y=accredited_by_state.index, x=accredited_by_state.values)
status_by_state.plot(kind="bar", stacked=True)
sns.heatmap(heat, annot=True, fmt="d", cmap="YlGnBu")`
    }
  ];

  const timelineButtons = document.querySelectorAll('.timeline-step-btn');
  const detailStepBadge = document.getElementById('detailStepBadge');
  const detailStepName = document.getElementById('detailStepName');
  const detailOp = document.getElementById('detailOp');
  const detailPurpose = document.getElementById('detailPurpose');
  const detailImpact = document.getElementById('detailImpact');
  const detailCode = document.getElementById('detailCode');

  timelineButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const stepIndex = parseInt(btn.getAttribute('data-step'), 10);
      const stepData = methodologySteps[stepIndex];

      if (!stepData) return;

      timelineButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      if (detailStepBadge) detailStepBadge.textContent = stepData.badge;
      if (detailStepName) detailStepName.textContent = stepData.name;
      if (detailOp) detailOp.textContent = stepData.op;
      if (detailPurpose) detailPurpose.textContent = stepData.purpose;
      if (detailImpact) detailImpact.textContent = stepData.impact;
      if (detailCode) detailCode.textContent = stepData.code;
    });
  });

  /* ==========================================================================
     7. LIGHTBOX MODAL FOR CHARTS
     ========================================================================== */
  const modal = document.getElementById('chartModal');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  function openModal(imgSrc, title, desc) {
    if (!modal || !modalImg) return;
    modalImg.src = imgSrc;
    modalImg.alt = title;
    if (modalTitle) modalTitle.textContent = title;
    if (modalDesc) modalDesc.textContent = desc || '';
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Cards click in Visualizations Gallery
  const visCards = document.querySelectorAll('.vis-card');
  visCards.forEach(card => {
    card.addEventListener('click', () => {
      const imgSrc = card.getAttribute('data-img');
      const title = card.getAttribute('data-title');
      const desc = card.getAttribute('data-desc');
      if (imgSrc) openModal(imgSrc, title, desc);
    });
  });

  // Chart Enlarge buttons inside Questions section
  const zoomBtns = document.querySelectorAll('.btn-zoom-chart');
  zoomBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const imgSrc = btn.getAttribute('data-img');
      const title = btn.getAttribute('data-title');
      const parentContainer = btn.closest('.q-chart-container');
      const caption = parentContainer ? parentContainer.querySelector('.chart-caption')?.textContent : '';
      if (imgSrc) openModal(imgSrc, title, caption);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Keyboard Escape listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
      closeModal();
    }
  });

  /* ==========================================================================
     8. BACK TO TOP BUTTON
     ========================================================================== */
  const backToTopBtn = document.getElementById('backToTop');

  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 450) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ==========================================================================
     9. KATEX MATH RENDERING COMPATIBILITY
     ========================================================================== */
  function renderAllMath() {
    if (typeof renderMathInElement === 'function') {
      try {
        renderMathInElement(document.body, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '\\[', right: '\\]', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\(', right: '\\)', display: false }
          ],
          throwOnError: false
        });
      } catch (err) {
        console.warn('KaTeX rendering note:', err);
      }
    }
  }

  // Trigger math rendering on DOM ready and after all assets load
  renderAllMath();
  window.addEventListener('load', renderAllMath);

  console.log('EDAV Project Presentation Layer Initialized Successfully.');
});
