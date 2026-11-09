import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  X,
  ExternalLink,
  Terminal,
  FileCode,
  Globe,
  Key,
  FolderGit2,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

interface NetlifyPublishModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NetlifyPublishModal: React.FC<NetlifyPublishModalProps> = ({
  isOpen,
  onClose
}) => {
  const [copiedToml, setCopiedToml] = useState(false);
  const [copiedFunction, setCopiedFunction] = useState(false);
  const [copiedCli, setCopiedCli] = useState(false);
  const [activeTab, setActiveTab] = useState<'steps' | 'code' | 'cli'>('steps');

  if (!isOpen) return null;

  const netlifyTomlContent = `[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[functions]
  node_bundler = "esbuild"

# Redirige las peticiones /api/* a la función Serverless de Express
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200

# Redirección SPA para que React gestione todas las rutas en el cliente
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200`;

  const netlifyFunctionContent = `import serverless from 'serverless-http';
import { app } from '../../server';

export const handler = serverless(app);`;

  const copyToClipboard = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadArchive = () => {
    window.location.href = '/api/export-project';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto no-print">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-3xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-slate-900 text-white p-6 sm:p-8 flex items-start justify-between border-b border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-[#00C7B7]/20 text-[#00C7B7] flex items-center justify-center border border-[#00C7B7]/30">
                  <Globe className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#00C7B7]">
                  Guía Oficial de Despliegue
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Publicar y Extraer RetroACA en Netlify
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Tu proyecto ya está 100% preparado con <code>netlify.toml</code> y Netlify Functions para soportar evaluación de PDFs y Gemini en la nube.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Download Box */}
          <div className="p-6 bg-gradient-to-r from-teal-50 via-emerald-50 to-teal-50/50 border-b border-emerald-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                  Descarga del Código Fuente Completo
                </span>
                <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                  Listo para Netlify
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 max-w-lg">
                Descarga un paquete comprimido con todo el código (React, Vite, Express, tipos, PDF parser, y configuración de Netlify).
              </p>
            </div>

            <button
              onClick={handleDownloadArchive}
              className="shrink-0 px-4 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold flex items-center space-x-2 shadow-md hover:shadow-lg transition-all"
            >
              <Download className="w-4 h-4 text-[#00C7B7]" />
              <span>Descargar Proyecto (.tar.gz)</span>
            </button>
          </div>

          {/* Subtabs */}
          <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 space-x-2">
            <button
              onClick={() => setActiveTab('steps')}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center space-x-1.5 ${
                activeTab === 'steps'
                  ? 'border-emerald-600 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FolderGit2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>1. Pasos de Despliegue (GitHub / Netlify)</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center space-x-1.5 ${
                activeTab === 'code'
                  ? 'border-emerald-600 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-blue-600" />
              <span>2. Archivos netlify.toml y Functions</span>
            </button>

            <button
              onClick={() => setActiveTab('cli')}
              className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center space-x-1.5 ${
                activeTab === 'cli'
                  ? 'border-emerald-600 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-slate-600" />
              <span>3. Despliegue por Terminal (Netlify CLI)</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 md:p-8 max-h-[60vh] overflow-y-auto space-y-6">
            {activeTab === 'steps' && (
              <div className="space-y-4">
                <div className="space-y-4 text-xs">
                  {/* Step 1 */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-start space-x-3.5">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900 text-sm">
                        Extraer el código y subirlo a GitHub
                      </h4>
                      <p className="text-slate-600 leading-relaxed">
                        Descomprime el archivo descargado (<code>tar -xzf retroaca-pasaporte-ascenso-netlify.tar.gz</code>) o copia los archivos a tu repositorio de Git:
                      </p>
                      <div className="bg-slate-900 text-slate-200 p-2.5 rounded-lg font-mono text-[11px] mt-1.5">
                        git init && git add . && git commit -m "Publicar RetroACA en Netlify"<br />
                        git branch -M main && git remote add origin &lt;URL-DE-TU-REPOSITORIO&gt;<br />
                        git push -u origin main
                      </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-start space-x-3.5">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900 text-sm">
                        Conectar el repositorio en Netlify
                      </h4>
                      <p className="text-slate-600 leading-relaxed">
                        Inicia sesión en <a href="https://app.netlify.com" target="_blank" rel="noreferrer" className="text-emerald-700 font-bold underline inline-flex items-center space-x-0.5"><span>app.netlify.com</span><ExternalLink className="w-3 h-3 ml-0.5 inline" /></a>, haz clic en <strong>«Add new site» &gt; «Import an existing project»</strong> y selecciona tu repositorio de GitHub.
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Netlify detectará automáticamente el archivo <code>netlify.toml</code> configurando:
                        <br />• <strong>Build command:</strong> <code>npm run build</code>
                        <br />• <strong>Publish directory:</strong> <code>dist</code>
                        <br />• <strong>Functions:</strong> <code>netlify/functions</code>
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start space-x-3.5">
                    <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </span>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1.5 text-emerald-950 font-bold text-sm">
                        <Key className="w-4 h-4 text-emerald-700" />
                        <span>Configurar la Variable de Entorno de Gemini</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed text-xs">
                        En Netlify ve a: <strong>Site configuration &gt; Environment variables &gt; Add a variable</strong>:
                      </p>
                      <div className="bg-white p-3 rounded-lg border border-emerald-300 font-mono text-[11px] space-y-1 text-slate-800 mt-2">
                        <div><strong>Key:</strong> <code>GEMINI_API_KEY</code></div>
                        <div><strong>Value:</strong> <code>&lt;Tu clave de API de Google AI Studio&gt;</code></div>
                      </div>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-start space-x-3.5">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      4
                    </span>
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900 text-sm">
                        ¡Pulsar «Deploy Site» y Disfrutar!
                      </h4>
                      <p className="text-slate-600 leading-relaxed">
                        Netlify construirá el frontend y desplegará la función serverless de Express. Obtendrás una URL pública inmediata (ej. <code>https://retroaca-cun.netlify.app</code>) con soporte completo de subida de PDF y calificación formativa.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'code' && (
              <div className="space-y-5">
                {/* netlify.toml */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 font-mono">
                      /netlify.toml (Configuración principal)
                    </span>
                    <button
                      onClick={() => copyToClipboard(netlifyTomlContent, setCopiedToml)}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    >
                      {copiedToml ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedToml ? '¡Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                  <pre className="p-3.5 bg-slate-900 text-slate-200 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
                    {netlifyTomlContent}
                  </pre>
                </div>

                {/* netlify/functions/api.ts */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 font-mono">
                      /netlify/functions/api.ts (Adaptador Serverless)
                    </span>
                    <button
                      onClick={() => copyToClipboard(netlifyFunctionContent, setCopiedFunction)}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    >
                      {copiedFunction ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedFunction ? '¡Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                  <pre className="p-3.5 bg-slate-900 text-slate-200 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
                    {netlifyFunctionContent}
                  </pre>
                </div>
              </div>
            )}

            {activeTab === 'cli' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Si prefieres desplegar directamente desde tu terminal local utilizando el CLI oficial de Netlify:
                </p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Comandos de Terminal</span>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `npm install -g netlify-cli\nnpm run build\nnetlify deploy --prod`,
                          setCopiedCli
                        )
                      }
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    >
                      {copiedCli ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCli ? '¡Copiado!' : 'Copiar comandos'}</span>
                    </button>
                  </div>

                  <pre className="p-4 bg-slate-900 text-slate-200 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
{`# 1. Instalar Netlify CLI globalmente
npm install -g netlify-cli

# 2. Iniciar sesión en tu cuenta
netlify login

# 3. Construir la aplicación
npm run build

# 4. Desplegar en producción
netlify deploy --prod`}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Compatible con Netlify Free y Pro Tier.
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
