import React, { useState, useRef, useEffect } from 'react';
import { FaCamera, FaUpload, FaSync, FaCheck, FaTimes } from 'react-icons/fa';
import '../styles/FaceRecognition.css';

const FaceRecognition = () => {
  const [captureMethod, setCaptureMethod] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognitionResult, setRecognitionResult] = useState(null);
  const [error, setError] = useState(null);
  const [webcamActive, setWebcamActive] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Função para iniciar a webcam
  const startWebcam = async () => {
    try {
      setCaptureMethod('webcam');
      setError(null);
      
      console.log("Solicitando acesso à câmera...");
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true,
        audio: false
      });
      
      console.log("Acesso à câmera concedido");
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Vários manipuladores de eventos para garantir que detectaremos quando o vídeo estiver pronto
        const setVideoActive = () => {
          console.log("Vídeo ativo!");
          setWebcamActive(true);
        };
        
        videoRef.current.addEventListener('loadeddata', setVideoActive);
        videoRef.current.addEventListener('loadedmetadata', setVideoActive);
        videoRef.current.addEventListener('play', setVideoActive);
        
        // Forçar verificação do estado do vídeo após um tempo
        setTimeout(() => {
          if (!webcamActive && videoRef.current && !videoRef.current.paused) {
            console.log("Vídeo detectado como ativo pelo timeout");
            setWebcamActive(true);
          }
        }, 1000);
        
        // Iniciar a reprodução
        try {
          await videoRef.current.play();
        } catch (playErr) {
          console.error("Erro ao reproduzir vídeo:", playErr);
        }
      }
    } catch (err) {
      console.error("Erro ao acessar webcam:", err);
      setError(`Falha ao acessar a câmera: ${err.message || "Erro desconhecido"}`);
      setCaptureMethod(null);
    }
  };

  // Captura uma foto da webcam
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    try {
      console.log("Capturando foto da webcam");
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // Definir dimensões do canvas para corresponder ao vídeo
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      
      // Desenhar o frame atual do vídeo no canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Converter para base64
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setImageData(imageDataUrl);
      
      // Parar a webcam
      stopWebcam();
      
      console.log("Foto capturada com sucesso");
    } catch (err) {
      console.error("Erro ao capturar foto:", err);
      setError("Falha ao capturar foto. Tente novamente.");
    }
  };

  // Para a webcam
  const stopWebcam = () => {
    console.log("Parando webcam");
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        console.log("Parando track:", track.kind);
        track.stop();
      });
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setWebcamActive(false);
    setCaptureMethod(null);
  };

  // Processa o upload de imagem
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Verificar se é uma imagem
    if (!file.type.match('image.*')) {
      setError('Por favor, selecione uma imagem válida.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageData(event.target.result);
      setCaptureMethod('upload');
      setRecognitionResult(null);
    };
    reader.readAsDataURL(file);
  };

  // Enviar imagem para reconhecimento
  const processImage = async () => {
    if (!imageData) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // Simular o envio para o backend com InsightFace
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simula tempo de processamento
      
      // Simular resultado de reconhecimento
      const mockResponse = {
        success: Math.random() > 0.3, // 70% chance de reconhecimento bem-sucedido
        user: Math.random() > 0.3 ? {
          id: '12345',
          name: 'João Silva',
          confidence: 0.985,
          accessGranted: true,
          lastRecognition: new Date().toISOString()
        } : null
      };

      setRecognitionResult(mockResponse);
    } catch (err) {
      console.error("Erro no processamento do reconhecimento:", err);
      setError('Ocorreu um erro ao processar a imagem. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Reiniciar o processo
  const resetProcess = () => {
    setImageData(null);
    setCaptureMethod(null);
    setRecognitionResult(null);
    setError(null);
    stopWebcam();
  };

  // Limpar recursos quando o componente é desmontado
  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, []);

  return (
    <div className="face-recognition-container">
      {/* Métodos de captura - mostrar apenas se nenhum método foi selecionado */}
      {!captureMethod && !imageData && (
        <div className="capture-methods">
          <button onClick={startWebcam} className="capture-btn webcam-btn">
            <FaCamera /> Usar Webcam
          </button>
          <div className="divider">ou</div>
          <label className="capture-btn upload-btn">
            <FaUpload /> Selecionar Imagem
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      )}

      {/* Container da webcam */}
      {captureMethod === 'webcam' && !imageData && (
        <div className="webcam-container">
          <div className="video-wrapper">
            {!webcamActive && (
              <div className="camera-loading">
                <div className="spinner"></div>
                <p>Iniciando câmera...</p>
              </div>
            )}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="webcam-video"
              style={{ display: webcamActive ? 'block' : 'none' }}
            />
          </div>
          
          <button 
            onClick={capturePhoto} 
            className="capture-photo-btn"
            disabled={!webcamActive}
          >
            <FaCamera /> Tirar Foto
          </button>
          
          <button 
            onClick={resetProcess} 
            className="reset-btn"
            style={{ marginTop: '10px' }}
          >
            <FaSync /> Cancelar
          </button>
        </div>
      )}

      {/* Canvas oculto para processamento */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Preview da imagem capturada */}
      {imageData && (
        <div className="preview-container">
          <img src={imageData} alt="Imagem capturada" className="preview-image" />
          
          <div className="action-buttons">
            {!isProcessing && !recognitionResult && (
              <>
                <button onClick={processImage} className="process-btn">
                  <FaCheck /> Processar Reconhecimento
                </button>
                <button onClick={resetProcess} className="reset-btn">
                  <FaSync /> Nova Captura
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Indicador de processamento */}
      {isProcessing && (
        <div className="processing-indicator">
          <div className="spinner"></div>
          <p>Processando reconhecimento facial...</p>
        </div>
      )}

      {/* Resultado do reconhecimento */}
      {recognitionResult && (
        <div className={`recognition-result ${recognitionResult.success ? 'success' : 'failure'}`}>
          <h3>Resultado do Reconhecimento</h3>
          
          {recognitionResult.success ? (
            <div className="user-recognized">
              <div className="result-icon success-icon">
                <FaCheck />
              </div>
              <h4>Usuário Reconhecido</h4>
              <div className="user-details">
                <p><strong>Nome:</strong> {recognitionResult.user.name}</p>
                <p><strong>Confiança:</strong> {(recognitionResult.user.confidence * 100).toFixed(1)}%</p>
                <p><strong>Status:</strong> {recognitionResult.user.accessGranted ? 'Acesso Liberado' : 'Acesso Negado'}</p>
              </div>
            </div>
          ) : (
            <div className="user-not-recognized">
              <div className="result-icon failure-icon">
                <FaTimes />
              </div>
              <h4>Usuário Não Reconhecido</h4>
              <p>Não foi possível identificar o usuário na base de dados.</p>
            </div>
          )}
          
          <button onClick={resetProcess} className="new-recognition-btn">
            <FaSync /> Novo Reconhecimento
          </button>
        </div>
      )}

      {/* Mensagem de erro */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={resetProcess} className="reset-btn">
            <FaSync /> Tentar Novamente
          </button>
        </div>
      )}
    </div>
  );
};

export default FaceRecognition;