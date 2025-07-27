import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { WeddingPartyService } from '../../services/weddingPartyService';
import type { WeddingParty, WeddingPartyRole } from '../../types';

const WeddingPartySection = styled.section`
  padding: 4rem 2rem;
  background: #f8f9fa;
  position: relative;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 3rem;
  font-weight: 300;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const WeddingPartyContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const RoleSection = styled.div`
  margin-bottom: 4rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const RoleTitle = styled.h3.withConfig({
  shouldForwardProp: (prop) => prop !== 'primaryColor'
})<{ primaryColor?: string }>`
  text-align: center;
  font-size: 1.8rem;
  color: ${props => props.primaryColor || '#667eea'};
  margin-bottom: 2rem;
  font-weight: 400;
  text-transform: capitalize;
`;

const MembersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  justify-items: center;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
  }
`;

const MemberCard = styled.div`
  background: white;
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  max-width: 280px;
  width: 100%;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
  }
`;

const MemberPhoto = styled.div.withConfig({
  shouldForwardProp: (prop) => !['primaryColor', 'secondaryColor', 'imageUrl'].includes(prop)
})<{ primaryColor?: string; secondaryColor?: string; imageUrl?: string }>`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: ${props => props.imageUrl 
    ? `url(${props.imageUrl}) center/cover no-repeat` 
    : `linear-gradient(135deg, ${props.primaryColor || '#667eea'} 0%, ${props.secondaryColor || '#764ba2'} 100%)`
  };
  margin: 0 auto 1.5rem auto;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  font-weight: 300;
  border: 4px solid white;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  
  @media (max-width: 768px) {
    width: 120px;
    height: 120px;
    font-size: 2.5rem;
  }
`;

const MemberName = styled.h4`
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const MemberRelationship = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin: 0;
  font-style: italic;
`;

const SideSection = styled.div`
  margin-bottom: 3rem;
`;

const SideTitle = styled.h3.withConfig({
  shouldForwardProp: (prop) => prop !== 'primaryColor'
})<{ primaryColor?: string }>`
  text-align: center;
  font-size: 1.5rem;
  color: ${props => props.primaryColor || '#667eea'};
  margin-bottom: 1.5rem;
  font-weight: 400;
`;

// Helper functions
const getRoleDisplayName = (role: WeddingPartyRole): string => {
  const roleNames = {
    maid_of_honor: 'Maid of Honor',
    best_man: 'Best Man',
    bridesmaid: 'Bridesmaids',
    groomsman: 'Groomsmen',
    flower_girl: 'Flower Girls',
    ring_bearer: 'Ring Bearers',
    officiant: 'Officiant',
    padrinos_velacion: 'Padrinos de Velación',
    padrinos_anillos: 'Padrinos de Anillos',
    padrinos_arras: 'Padrinos de Arras',
    padrinos_lazo: 'Padrinos de Lazo',
    padrinos_biblia: 'Padrinos de Biblia y Rosario',
    padrinos_cojines: 'Padrinos de Cojines',
    padrinos_ramo: 'Padrinos de Ramo',
    other: 'Wedding Party'
  };
  return roleNames[role] || role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const groupMembersByRole = (members: WeddingParty[]) => {
  const grouped: Record<string, WeddingParty[]> = {};
  members.forEach(member => {
    if (!grouped[member.role]) {
      grouped[member.role] = [];
    }
    grouped[member.role].push(member);
  });
  
  // Sort each group by order
  Object.keys(grouped).forEach(role => {
    grouped[role].sort((a, b) => a.order - b.order);
  });
  
  return grouped;
};

const groupMembersBySide = (members: WeddingParty[]) => {
  const bride = members.filter(m => m.side === 'bride');
  const groom = members.filter(m => m.side === 'groom');
  const couple = members.filter(m => m.side === 'couple' || !m.side);
  
  return { bride, groom, couple };
};

interface WeddingPartyDisplayProps {
  weddingId: string;
  primaryColor?: string;
  secondaryColor?: string;
  showByRole?: boolean; // true = group by role, false = group by side
}

export const WeddingPartyDisplay: React.FC<WeddingPartyDisplayProps> = ({
  weddingId,
  primaryColor = '#667eea',
  secondaryColor = '#764ba2',
  showByRole = true
}) => {
  const [weddingParty, setWeddingParty] = useState<WeddingParty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeddingParty = async () => {
      try {
        setLoading(true);
        const members = await WeddingPartyService.getWeddingPartyMembers(weddingId);
        setWeddingParty(members);
      } catch (error) {
        console.error('Error fetching wedding party:', error);
      } finally {
        setLoading(false);
      }
    };

    if (weddingId) {
      fetchWeddingParty();
    }
  }, [weddingId]);

  if (loading) {
    return (
      <WeddingPartySection>
        <SectionTitle>Loading Wedding Party...</SectionTitle>
      </WeddingPartySection>
    );
  }

  if (weddingParty.length === 0) {
    return null; // Don't render section if no wedding party members
  }

  const renderMember = (member: WeddingParty) => (
    <MemberCard key={member.id}>
      <MemberPhoto
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        imageUrl={member.photo}
      >
        {!member.photo && `${member.firstName.charAt(0)}${member.lastName.charAt(0)}`}
      </MemberPhoto>
      <MemberName>{member.firstName} {member.lastName}</MemberName>
      {member.relationship && (
        <MemberRelationship>{member.relationship}</MemberRelationship>
      )}
    </MemberCard>
  );

  return (
    <WeddingPartySection>
      <SectionTitle>Our Wedding Party</SectionTitle>
      <WeddingPartyContainer>
        {showByRole ? (
          // Group by role
          Object.entries(groupMembersByRole(weddingParty)).map(([role, members]) => (
            <RoleSection key={role}>
              <RoleTitle primaryColor={primaryColor}>
                {getRoleDisplayName(role as WeddingPartyRole)}
              </RoleTitle>
              <MembersGrid>
                {members.map(renderMember)}
              </MembersGrid>
            </RoleSection>
          ))
        ) : (
          // Group by side
          (() => {
            const { bride, groom, couple } = groupMembersBySide(weddingParty);
            return (
              <>
                {bride.length > 0 && (
                  <SideSection>
                    <SideTitle primaryColor={primaryColor}>Bride's Party</SideTitle>
                    <MembersGrid>
                      {bride.map(renderMember)}
                    </MembersGrid>
                  </SideSection>
                )}
                {groom.length > 0 && (
                  <SideSection>
                    <SideTitle primaryColor={primaryColor}>Groom's Party</SideTitle>
                    <MembersGrid>
                      {groom.map(renderMember)}
                    </MembersGrid>
                  </SideSection>
                )}
                {couple.length > 0 && (
                  <SideSection>
                    <SideTitle primaryColor={primaryColor}>Wedding Party</SideTitle>
                    <MembersGrid>
                      {couple.map(renderMember)}
                    </MembersGrid>
                  </SideSection>
                )}
              </>
            );
          })()
        )}
      </WeddingPartyContainer>
    </WeddingPartySection>
  );
};
