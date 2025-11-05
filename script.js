import gsap from "gsap"
import { CustomEase } from "gsap/CustomEase"
import { SplitText } from "gsap/SplitText"

document.fonts.ready.then(() => {
    gsap.registerPlugin(CustomEase, SplitText);
    CustomEase.create("hop", ".8, 0, .3, 1");
    
    const splitTextElements = (selector, type = "words,chars", addFirstChar = false) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
            const splitText = new SplitText(element, {
                type,
                wordsClass: "word",
                charsClass: "char",
            });
            
            if (type.includes("chars")) {
                splitText.chars.forEach((char, index) => {
                    const originalText = char.textContent;
                    char.innerHTML = `<span>${originalText}</span>`;
                    if (addFirstChar && index === 0) {
                        char.classList.add("first-char");
                    }
                });
            }
        });
    };
    
    splitTextElements(".intro-title h1", "words,chars", true);
    splitTextElements(".outro-title h1");
    splitTextElements(".tag p", "words");

    // Configurar posición inicial del split-overlay (invisible al inicio)
    gsap.set(
        [
            ".split-overlay .intro-title .first-char span",
            ".split-overlay .outro-title .char span",
        ],
        { y: "0%" }
    );

    const tl = gsap.timeline({ defaults: { ease: "hop"} });
    const tags = gsap.utils.toArray(".tag");

    tags.forEach((tag, index) => {
        tl.to(tag.querySelectorAll("p .word"), {
            y: "0%",
            duration: 0.75,
        },
        0.5 + index * 0.1
        );
    });

    // Animar ambos intro-title (preloader y split-overlay)
    tl.to([".preloader .intro-title .char span", ".split-overlay .intro-title .char span"], {
        y: "0%",
        duration: 0.75,
        stagger: 0.05,
    }, 
    0.5 
    )
    .to([".preloader .intro-title .char:not(.first-char) span", ".split-overlay .intro-title .char:not(.first-char) span"], {
        y: "200%",
        duration: 0.75,
        stagger: 0.05,
    }, 2
    )
    .to([".preloader .outro-title .char span", ".split-overlay .outro-title .char span"], {
        y: "0%",
        duration: 0.75,
        stagger: 0.075,
    }, 2.5
    )
    .to([".preloader .intro-title .first-char", ".split-overlay .intro-title .first-char"], {
        x: "21.25rem",
        duration: 1,
    }, 3.5
    )
    .to([".preloader .outro-title .char", ".split-overlay .outro-title .char"], {
        x: "-8rem",
        duration: 1,
    }, 3.5
    )
    // CORREGIDO: Selector correcto y animar ambos
    .to([".preloader .intro-title .first-char", ".split-overlay .intro-title .first-char"], {
        x: "23rem",  // Ajustar según necesites
        fontWeight: "900",
        fontSize: "8rem",
        
        duration: 0.75,
    }, 4.5
    )
    .to([".preloader .outro-title .char", ".split-overlay .outro-title .char"], {
        x: "-8rem",    
        fontSize: "8rem",
        fontWeight: "900",
        
        duration: 0.75,
        onComplete: () => {
            // Aplicar clip-path para dividir
            gsap.set(".preloader", {
                clipPath: "polygon(0 0, 100% 0, 100% 50%, 0% 50%)",
            });
            gsap.set(".split-overlay", {
                clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0% 100%)",
            });
        },
    },
    4.5
    )
    .to(".container", {
        clipPath: "polygon(0 48%, 100% 48%, 100% 52%, 0% 52%)",
        duration: 1,
    },
    5
    );

    tags.forEach((tag, index) => {
        tl.to(
            tag.querySelectorAll("p .word"),
            {
                y: "100%",
                duration: 0.75,
            },
            5.5 + index * 0.1
        );
    });

    // Separar las mitades
    tl.to([".preloader", ".split-overlay"], {
        y: (i) => (i === 0 ? "-50%" : "50%"),
        duration: 1,
    },
    6
    ).to(".container",{
		clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
		duration: 1,
	},
	6
	);

        // Animaciones del menú
    const openMenuBtn = document.getElementById('open-menu');
    const closeMenuBtn = document.getElementById('close-menu');
    const fullscreenMenu = document.querySelector('.fullscreen-menu');
    const menuLinks = document.querySelectorAll('.menu-links a');

    // Abrir menú
openMenuBtn.addEventListener('click', () => {
    gsap.timeline()
        .set(fullscreenMenu, { visibility: 'visible' })
        .fromTo(fullscreenMenu,
            {
                scale: 0.8,
                opacity: 0,
                rotation: 5
            },
            {
                scale: 1,
                opacity: 1,
                rotation: 0,
                duration: 0.7,
                ease: 'power3.out'
            }
        )
        .fromTo(closeMenuBtn, 
            {
                scale: 0,
                rotation: -360,
                opacity: 0
            }, 
            {
                scale: 1,
                rotation: 0,
                opacity: 1,
                duration: 0.6,
                ease: 'elastic.out(1, 0.5)'
            },
            '<0.3'
        )
        .fromTo(menuLinks,
            { y: 100, opacity: 0, rotationX: -90 },
            { 
                y: 0, 
                opacity: 1, 
                rotationX: 0,
                duration: 0.6, 
                stagger: 0.1,
                ease: 'back.out(2)'
            },
            '<0.4'
        );
});

// Cerrar menú
closeMenuBtn.addEventListener('click', () => {
    gsap.timeline()
        .to(closeMenuBtn, {
            scale: 0,
            rotation: 360,
            opacity: 0,
            duration: 0.4,
            ease: 'back.in(2)'
        })
        .to(fullscreenMenu, {
            scale: 0.8,
            opacity: 0,
            rotation: -5,
            duration: 0.5,
            ease: 'power3.in'
        }, '<')
        .set(fullscreenMenu, { visibility: 'hidden' });
});

// Hover effect para el botón hamburguesa (añade después del código del menú)
openMenuBtn.addEventListener('mouseenter', () => {
    gsap.to('#open-menu .line-top', {
        y: -3,
        duration: 0.3,
        ease: 'power2.out'
    });
    gsap.to('#open-menu .line-bottom', {
        y: 3,
        duration: 0.3,
        ease: 'power2.out'
    });
});

openMenuBtn.addEventListener('mouseleave', () => {
    gsap.to('#open-menu .line-top', {
        y: 0,
        duration: 0.3,
        ease: 'power2.out'
    });
    gsap.to('#open-menu .line-bottom', {
        y: 0,
        duration: 0.3,
        ease: 'power2.out'
    });
});
});



