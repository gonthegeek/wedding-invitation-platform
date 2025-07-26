import React from 'react';
import { Layout } from '../components/shared/Layout';
import WeddingCreationWizard from '../components/wedding/WeddingCreationWizard';

export const CreateWeddingPage: React.FC = () => {
  return (
    <Layout>
      <WeddingCreationWizard />
    </Layout>
  );
};
