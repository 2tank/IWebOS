import React, { useEffect } from 'react';

const TranslateComponent = () => {
  useEffect(() => {
    // Cargar el script de Google Translate
    const addScript = document.createElement('script');
    addScript.setAttribute(
      'src',
      '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    );
    document.body.appendChild(addScript);

    // Inicializar Google Translate
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'es',
          includedLanguages: 'es,en,fr,de,zh-CN,ru,pt-BR,pt-PT', // Idiomas seleccionados
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        'google_translate_element'
      );
    };

    // Remover barra superior y valoraciones al hacer hover
    const removeGoogleElements = () => {
      const observer = new MutationObserver(() => {
        // Remover barra superior
        const googleBar = document.querySelector('.goog-te-banner-frame');
        if (googleBar) googleBar.remove();

        // Remover iconos de valoración
        const feedbackElements = document.querySelectorAll('[id*=\":rf:\"]');
        feedbackElements.forEach((element) => element.remove());
      });

      observer.observe(document.body, { childList: true, subtree: true });
    };

    removeGoogleElements();

    return () => {
      // Limpiar el script al desmontar el componente
      document.body.removeChild(addScript);
    };
  }, []);

  return (
    <div>
      {/* Elemento contenedor de Google Translate */}
      <div id="google_translate_element"></div>
    </div>
  );
};

export default TranslateComponent;