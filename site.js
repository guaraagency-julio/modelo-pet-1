/* Interações do modelo Petcare — sem dependências externas */
(() => {
  'use strict';

  const header = document.querySelector('.site-header');
  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 32);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  const closeMenu = () => {
    menu?.setAttribute('aria-expanded', 'false');
    menu?.setAttribute('aria-label', 'Abrir menu');
    nav?.classList.remove('is-open');
  };
  menu?.addEventListener('click', () => {
    const expanded = menu.getAttribute('aria-expanded') === 'true';
    menu.setAttribute('aria-expanded', String(!expanded));
    menu.setAttribute('aria-label', expanded ? 'Abrir menu' : 'Fechar menu');
    nav?.classList.toggle('is-open', !expanded);
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  document.addEventListener('click', e => {
    if (!e.target.closest('.nav-container')) closeMenu();
  });

  const revealElements = document.querySelectorAll('.reveal');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('visible'));
  } else {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: .09, rootMargin: '0px 0px -35px 0px' });
    revealElements.forEach(el => observer.observe(el));
  }

  const testimonials = [...document.querySelectorAll('.quote-list .quote')];
  const count = document.getElementById('testimonial-count');
  let quoteIndex = 0;
  const showQuote = index => {
    quoteIndex = (index + testimonials.length) % testimonials.length;
    testimonials.forEach((item, i) => {
      item.hidden = i !== quoteIndex;
      item.classList.toggle('is-active', i === quoteIndex);
    });
    if (count) count.textContent = String(quoteIndex + 1).padStart(2, '0') + ' / ' + String(testimonials.length).padStart(2, '0');
  };
  document.getElementById('testimonial-prev')?.addEventListener('click', () => showQuote(quoteIndex - 1));
  document.getElementById('testimonial-next')?.addEventListener('click', () => showQuote(quoteIndex + 1));

  const imageBase = 'https://images.pexels.com/photos/';
  const services = {
    consultas: {
      marker: '01 — CUIDADO CLÍNICO',
      title: 'Consultas para acompanhar cada fase.',
      text: 'Uma avaliação atenta para compreender sinais, responder dúvidas e orientar as próximas etapas com clareza. Porque cada pet merece um plano de cuidados individualizado.',
      image: imageBase + '7470754/pexels-photo-7470754.jpeg?auto=compress&cs=tinysrgb&w=1200',
      alt: 'Atendimento veterinário de um cão em consultório'
    },
    vacinas: {
      marker: '02 — MEDICINA PREVENTIVA',
      title: 'Prevenir é uma forma de demonstrar carinho.',
      text: 'Vacinação, orientações preventivas e acompanhamento de rotina para que cada pet tenha um plano de cuidados alinhado à idade, à espécie e às necessidades de saúde.',
      image: imageBase + '6234618/pexels-photo-6234618.jpeg?auto=compress&cs=tinysrgb&w=1200',
      alt: 'Profissional veterinário examinando um animal'
    },
    odontologia: {
      marker: '03 — SAÚDE BUCAL',
      title: 'Um sorriso saudável também precisa de atenção.',
      text: 'A avaliação oral pode identificar alterações e ajudar o tutor a compreender os cuidados necessários para manter a saúde e o conforto do animal.',
      image: imageBase + '1583337130417-3346a1be7dee/pexels-photo-1583337130417-3346a1be7dee.jpeg?auto=compress&cs=tinysrgb&w=1200',
      alt: 'Cachorro de pequeno porte olhando para a câmera'
    },
    exames: {
      marker: '04 — AVALIAÇÃO E DIAGNÓSTICO',
      title: 'Mais informações para decidir com segurança.',
      text: 'A indicação de exames complementares depende da avaliação do profissional e do quadro clínico. Nossa proposta é oferecer explicações claras em cada etapa.',
      image: imageBase + '6234627/pexels-photo-6234627.jpeg?auto=compress&cs=tinysrgb&w=1200',
      alt: 'Veterinário realizando avaliação de cachorro'
    }
  };
  const tabs = [...document.querySelectorAll('.service-tab')];
  const panel = document.getElementById('service-content');
  const selectTab = tab => {
    const key = tab.dataset.service;
    const data = services[key];
    if (!data) return;
    tabs.forEach(item => {
      const selected = item === tab;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', tab.id);
    document.getElementById('service-number').textContent = data.marker;
    document.getElementById('service-title').textContent = data.title;
    document.getElementById('service-description').textContent = data.text;
    const image = document.getElementById('service-image');
    image.src = data.image;
    image.alt = data.alt;
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', e => {
      let target = index;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') target = (index + 1) % tabs.length;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') target = (index - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') target = 0;
      else if (e.key === 'End') target = tabs.length - 1;
      else return;
      e.preventDefault();
      tabs[target].focus();
      selectTab(tabs[target]);
    });
  });

  const dialog = document.getElementById('booking-dialog');
  document.querySelectorAll('.js-book').forEach(button => button.addEventListener('click', () => {
    if (dialog?.showModal) dialog.showModal();
    else document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' });
  }));
  document.getElementById('dialog-goto-contact')?.addEventListener('click', () => dialog?.close());
  dialog?.addEventListener('click', e => {
    if (e.target === dialog) dialog.close();
  });

  const form = document.getElementById('appointment-form');
  const prepared = document.getElementById('prepared-message');
  const output = document.getElementById('message-output');
  const copyStatus = document.getElementById('copy-status');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    const name = String(values.get('nome') || '').trim();
    const pet = String(values.get('pet') || '').trim();
    const email = String(values.get('email') || '').trim();
    const service = String(values.get('servico') || '');
    const message = String(values.get('mensagem') || '').trim();
    output.value = [
      'Olá! Gostaria de solicitar um atendimento veterinário.',
      '',
      'Meu nome: ' + name,
      'Nome do pet: ' + pet,
      'Atendimento: ' + service,
      ...(email ? ['E-mail: ' + email] : []),
      ...(message ? ['Observações: ' + message] : []),
      '',
      'Gostaria de saber sobre disponibilidade e próximos passos.'
    ].join('\n');
    prepared.hidden = false;
    copyStatus.textContent = '';
    prepared.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
  document.getElementById('copy-message')?.addEventListener('click', async () => {
    if (!output?.value) return;
    try {
      if (navigator.clipboard?.writeText && window.isSecureContext) {
        await navigator.clipboard.writeText(output.value);
      } else {
        output.focus(); output.select();
        if (!document.execCommand('copy')) throw new Error('Falha ao copiar');
      }
      copyStatus.textContent = 'Copiado!';
    } catch {
      output.focus(); output.select();
      copyStatus.textContent = 'Selecione e copie o texto acima.';
    }
  });

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();