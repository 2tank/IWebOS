import React, { useState } from "react";

const LanguageSelector = ({ setTargetLanguage }) => {
  
  const languages = [
    { code: "en", name: "Inglés" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Francés" },
    { code: "de", name: "Alemán" },
    { code: "zh-Hans", name: "Chino Simplificado" },
    { code: "ja", name: "Japonés" },
  ];

  return (
    <div>
      <label htmlFor="language">Seleccione el idioma de traducción:</label>
      <select
        id="language"
        onChange={(e) => setTargetLanguage(e.target.value)}
        className="border p-2 rounded w-fit mx-2"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;