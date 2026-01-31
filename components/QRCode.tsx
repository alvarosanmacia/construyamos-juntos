import React, { useRef, useCallback } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

interface QRCodeProps {
  value: string;
  size?: number;
  bgColor?: string;
  fgColor?: string;
  level?: 'L' | 'M' | 'Q' | 'H';
  includeMargin?: boolean;
  className?: string;
  id?: string;
}

interface QRCodeWithDownloadProps extends QRCodeProps {
  showDownloadButton?: boolean;
  downloadFileName?: string;
  onDownload?: () => void;
}

const QRCode: React.FC<QRCodeWithDownloadProps> = ({
  value,
  size = 128,
  bgColor = '#ffffff',
  fgColor = '#000000',
  level = 'M',
  includeMargin = true,
  className = '',
  id = 'qr-code',
  showDownloadButton = false,
  downloadFileName = 'qr-code',
  onDownload
}) => {
  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(() => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;

    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = `${downloadFileName}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onDownload?.();
  }, [downloadFileName, onDownload]);

  return (
    <div className={`inline-block ${className}`}>
      <div ref={qrRef} id={id}>
        <QRCodeCanvas
          value={value}
          size={size}
          bgColor={bgColor}
          fgColor={fgColor}
          level={level}
          includeMargin={includeMargin}
        />
      </div>
      {showDownloadButton && (
        <button
          onClick={handleDownload}
          className="mt-2 w-full text-xs font-bold text-campaign-orange hover:text-campaign-dark transition-colors py-1"
        >
          Descargar QR
        </button>
      )}
    </div>
  );
};

// Función exportada para descargar QR desde fuera del componente
export const downloadQRCode = (elementId: string, fileName: string = 'qr-code'): boolean => {
  const container = document.getElementById(elementId);
  const canvas = container?.querySelector('canvas');
  if (!canvas) return false;

  const url = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return true;
};

export default QRCode;
