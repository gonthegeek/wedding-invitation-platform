import React, { useState } from 'react';
import styled from 'styled-components';
import { Upload, Download, FileText, X, CheckCircle, AlertCircle, Users } from 'lucide-react';
import { GuestImportExportService, type GuestCSVData } from '../../services/guestImportExportService';
import { GuestService } from '../../services/guestService';
import type { Guest } from '../../types/guest';

const Container = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
`;

const Header = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceAlt};
`;

const Title = styled.h3`
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Subtitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
`;

const Content = styled.div`
  padding: 1.5rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h4`
  margin: 0 0 1rem;
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'outline' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: ${props => {
    switch (props.variant) {
      case 'primary': return 'none';
      case 'secondary': return `1px solid ${props.theme.colors.border}`;
      case 'outline': return `1px solid ${props.theme.colors.primary}`;
      default: return `1px solid ${props.theme.colors.border}`;
    }
  }};
  background: ${props => {
    switch (props.variant) {
      case 'primary': return props.theme.colors.primary;
      case 'secondary': return props.theme.colors.surface;
      case 'outline': return props.theme.colors.surface;
      default: return props.theme.colors.surface;
    }
  }};
  color: ${props => {
    switch (props.variant) {
      case 'primary': return 'white';
      case 'outline': return props.theme.colors.primary;
      default: return props.theme.colors.textPrimary;
    }
  }};
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
    filter: brightness(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const FileDropZone = styled.div<{ isDragOver: boolean }>`
  border: 2px dashed ${props => props.isDragOver ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  background: ${props => props.isDragOver ? props.theme.colors.surfaceAlt : props.theme.colors.surfaceAlt};
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FileInput = styled.input`
  display: none;
`;

const DropZoneContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const DropZoneIcon = styled.div`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const DropZoneText = styled.div`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 500;
`;

const DropZoneSubtext = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const PreviewContainer = styled.div`
  margin-top: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  overflow: hidden;
`;

const PreviewHeader = styled.div`
  padding: 1rem;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PreviewTitle = styled.h5`
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const CloseButton = styled.button`
  padding: 0.25rem;
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  border-radius: 4px;
  
  &:hover {
    background: ${({ theme }) => theme.colors.surfaceAlt};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const PreviewContent = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const ValidationResults = styled.div`
  padding: 1rem;
`;

const ValidationSection = styled.div`
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ValidationTitle = styled.div<{ color?: string }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${({ color, theme }) => color || theme.colors.textPrimary};
`;

const ValidationList = styled.ul`
  margin: 0;
  padding-left: 1.5rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ValidationItem = styled.li`
  margin-bottom: 0.25rem;
`;

const ImportActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceAlt};
`;

interface GuestImportExportProps {
  weddingId: string;
  guests: Guest[];
  onImportComplete: () => void;
}

export const GuestImportExport: React.FC<GuestImportExportProps> = ({
  weddingId,
  guests,
  onImportComplete
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [importData, setImportData] = useState<GuestCSVData[] | null>(null);
  const [validationResults, setValidationResults] = useState<{
    valid: GuestCSVData[];
    invalid: { guest: GuestCSVData; errors: string[] }[];
  } | null>(null);
  const [importing, setImporting] = useState(false);

  const handleFileSelect = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      alert('Please select a CSV file');
      return;
    }

    try {
      const csvData = await GuestImportExportService.importGuestsFromFile(file);
      const validation = GuestImportExportService.validateImportData(csvData);
      
      setImportData(csvData);
      setValidationResults(validation);
    } catch (error) {
      console.error('Error importing file:', error);
      alert(`Error importing file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleImport = async () => {
    if (!validationResults?.valid.length) {
      alert('No valid guests to import');
      return;
    }

    try {
      setImporting(true);
      
      // Convert to GuestImport format
      const guestImports = validationResults.valid.map(guestData => ({
        firstName: guestData.firstName,
        lastName: guestData.lastName,
        email: guestData.email,
        phone: guestData.phone,
        group: guestData.relationship, // Use relationship as group
        allowPlusOnes: (guestData.plusOnes || 0) > 0,
      }));

      // Import guests using the bulk import method
      await GuestService.createMultipleGuests(weddingId, guestImports);

      alert(`Successfully imported ${validationResults.valid.length} guests`);
      onImportComplete();
      clearImportData();
    } catch (error) {
      console.error('Error importing guests:', error);
      alert('Error importing guests. Please try again.');
    } finally {
      setImporting(false);
    }
  };

  const clearImportData = () => {
    setImportData(null);
    setValidationResults(null);
  };

  const downloadTemplate = () => {
    GuestImportExportService.downloadCSVTemplate();
  };

  const exportGuests = () => {
    if (guests.length === 0) {
      alert('No guests to export');
      return;
    }
    
    const filename = `wedding_guests_${new Date().toISOString().split('T')[0]}.csv`;
    GuestImportExportService.exportGuestsToCSV(guests, filename);
  };

  return (
    <Container>
      <Header>
        <Title>Guest Import/Export</Title>
        <Subtitle>Import guest lists from CSV files or export your current guest list</Subtitle>
      </Header>
      
      <Content>
        <Section>
          <SectionTitle>
            <Download size={16} />
            Export Current Guest List
          </SectionTitle>
          <ButtonGroup>
            <Button variant="secondary" onClick={exportGuests} disabled={guests.length === 0}>
              <Download size={16} />
              Export to CSV ({guests.length} guests)
            </Button>
            <Button variant="outline" onClick={downloadTemplate}>
              <FileText size={16} />
              Download Template
            </Button>
          </ButtonGroup>
        </Section>

        <Section>
          <SectionTitle>
            <Upload size={16} />
            Import Guest List
          </SectionTitle>
          
          {!importData ? (
            <FileDropZone
              isDragOver={isDragOver}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <DropZoneContent>
                <DropZoneIcon>📁</DropZoneIcon>
                <DropZoneText>
                  {isDragOver ? 'Drop CSV file here' : 'Click to select or drag CSV file here'}
                </DropZoneText>
                <DropZoneSubtext>
                  Supported format: CSV with firstName, lastName, email columns
                </DropZoneSubtext>
              </DropZoneContent>
              <FileInput
                id="file-input"
                type="file"
                accept=".csv"
                onChange={handleFileInputChange}
              />
            </FileDropZone>
          ) : (
            <PreviewContainer>
              <PreviewHeader>
                <PreviewTitle>Import Preview ({importData.length} guests found)</PreviewTitle>
                <CloseButton onClick={clearImportData}>
                  <X size={16} />
                </CloseButton>
              </PreviewHeader>
              
              <PreviewContent>
                {validationResults && (
                  <ValidationResults>
                    <ValidationSection>
                      <ValidationTitle color="#059669">
                        <CheckCircle size={16} />
                        Valid Guests ({validationResults.valid.length})
                      </ValidationTitle>
                      {validationResults.valid.length > 0 && (
                        <ValidationList>
                          {validationResults.valid.slice(0, 5).map((guest, index) => (
                            <ValidationItem key={index}>
                              {guest.firstName} {guest.lastName} ({guest.email})
                            </ValidationItem>
                          ))}
                          {validationResults.valid.length > 5 && (
                            <ValidationItem>
                              ... and {validationResults.valid.length - 5} more
                            </ValidationItem>
                          )}
                        </ValidationList>
                      )}
                    </ValidationSection>

                    {validationResults.invalid.length > 0 && (
                      <ValidationSection>
                        <ValidationTitle color="#dc2626">
                          <AlertCircle size={16} />
                          Invalid Guests ({validationResults.invalid.length})
                        </ValidationTitle>
                        <ValidationList>
                          {validationResults.invalid.slice(0, 5).map((item, index) => (
                            <ValidationItem key={index}>
                              {item.guest.firstName || 'Unknown'} {item.guest.lastName || 'Unknown'}: {item.errors.join(', ')}
                            </ValidationItem>
                          ))}
                          {validationResults.invalid.length > 5 && (
                            <ValidationItem>
                              ... and {validationResults.invalid.length - 5} more errors
                            </ValidationItem>
                          )}
                        </ValidationList>
                      </ValidationSection>
                    )}
                  </ValidationResults>
                )}
              </PreviewContent>

              <ImportActions>
                <Button onClick={clearImportData}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleImport}
                  disabled={!validationResults?.valid.length || importing}
                >
                  <Users size={16} />
                  {importing ? 'Importing...' : `Import ${validationResults?.valid.length || 0} Guests`}
                </Button>
              </ImportActions>
            </PreviewContainer>
          )}
        </Section>
      </Content>
    </Container>
  );
};
