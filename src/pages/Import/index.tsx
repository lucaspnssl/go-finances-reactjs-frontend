import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const [error, setError] = useState<string>();
  const history = useHistory();

  async function handleUpload(): Promise<void> {
    if (uploadedFiles.length === 0) {
      setError('Escolha um arquivo válido para realizar a importação.');
      return;
    }

    const data = new FormData();
    const uploadedFile = uploadedFiles[0];

    data.append('file', uploadedFile.file, uploadedFile.name);
    try {
      await api.post('/transactions/import', data);
      setError('');
      history.push('/');
    } catch (err) {
      setError('Não foi possível importar os dados do arquivo.');
    }
  }

  function submitFile(files: File[]): void {
    const uploadedFilesProps: FileProps[] = files.map(file => ({
      name: file.name,
      file,
      readableSize: filesize(file.size),
    }));

    setUploadedFiles(uploadedFilesProps);
    setError('');
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {error && <p>{error}</p>}
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
