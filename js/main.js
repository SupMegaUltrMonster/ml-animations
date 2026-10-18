import { initNeuralNetwork, resetNeuralNetwork } from './animations/neural-network.js';
import { initTraining, resetTraining } from './animations/training.js';
import { initClassification, resetClassification } from './animations/classification.js';
import { initGradientDescent, resetGradientDescent } from './animations/gradient-descent.js';

const animations = {
    'neural-network': { init: initNeuralNetwork, reset: resetNeuralNetwork },
    'training': { init: initTraining, reset: resetTraining },
    'classification': { init: initClassification, reset: resetClassification },
    'gradient-descent': { init: initGradientDescent, reset: resetGradientDescent }
};

document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn[data-animation]');
    
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const animName = button.dataset.animation;
            const anim = animations[animName];
            
            if (anim) {
                anim.reset();
                anim.init();
                button.textContent = 'Перезапустить';
            }
        });
    });

    const nextButtons = document.querySelectorAll('.btn[data-next]');
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.next;
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    gsap.registerPlugin(ScrollTrigger);

    gsap.from('.header__title', {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'power3.out'
    });

    gsap.from('.header__subtitle', {
        opacity: 0,
        y: 20,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out'
    });

    document.querySelectorAll('.section').forEach(section => {
        gsap.from(section.querySelector('.section__title'), {
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: 'power3.out'
        });

        gsap.from(section.querySelector('.section__description'), {
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 15,
            duration: 0.8,
            delay: 0.2,
            ease: 'power3.out'
        });
    });

    const topBtn = document.querySelector('.footer__top-btn');
    if (topBtn) {
        topBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
