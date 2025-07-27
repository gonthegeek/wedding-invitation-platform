import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy,
  getDocs,
  getDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import type { WeddingParty, WeddingPartyRole } from '../types';

export class WeddingPartyService {
  private static readonly WEDDING_PARTY_COLLECTION = 'weddingParty';

  static async addWeddingPartyMember(
    weddingId: string,
    member: Omit<WeddingParty, 'id'>
  ): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.WEDDING_PARTY_COLLECTION), {
        ...member,
        weddingId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding wedding party member:', error);
      throw new Error('Failed to add wedding party member');
    }
  }

  static async updateWeddingPartyMember(
    id: string,
    updates: Partial<Omit<WeddingParty, 'id' | 'weddingId'>>
  ): Promise<void> {
    try {
      const memberRef = doc(db, this.WEDDING_PARTY_COLLECTION, id);
      await updateDoc(memberRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating wedding party member:', error);
      throw new Error('Failed to update wedding party member');
    }
  }

  static async deleteWeddingPartyMember(id: string): Promise<void> {
    try {
      const memberRef = doc(db, this.WEDDING_PARTY_COLLECTION, id);
      await deleteDoc(memberRef);
    } catch (error) {
      console.error('Error deleting wedding party member:', error);
      throw new Error('Failed to delete wedding party member');
    }
  }

  static async getWeddingPartyMembers(weddingId: string): Promise<WeddingParty[]> {
    try {
      const q = query(
        collection(db, this.WEDDING_PARTY_COLLECTION),
        where('weddingId', '==', weddingId),
        orderBy('order', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      const members: WeddingParty[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        members.push({
          id: doc.id,
          weddingId: data.weddingId,
          role: data.role,
          firstName: data.firstName,
          lastName: data.lastName,
          relationship: data.relationship,
          photo: data.photo,
          order: data.order,
        });
      });
      
      return members;
    } catch (error) {
      console.error('Error fetching wedding party members:', error);
      throw new Error('Failed to fetch wedding party members');
    }
  }

  static async getWeddingPartyMember(id: string): Promise<WeddingParty | null> {
    try {
      const memberRef = doc(db, this.WEDDING_PARTY_COLLECTION, id);
      const memberSnap = await getDoc(memberRef);
      
      if (!memberSnap.exists()) {
        return null;
      }
      
      const data = memberSnap.data();
      return {
        id: memberSnap.id,
        weddingId: data.weddingId,
        role: data.role,
        firstName: data.firstName,
        lastName: data.lastName,
        relationship: data.relationship,
        photo: data.photo,
        order: data.order,
      };
    } catch (error) {
      console.error('Error fetching wedding party member:', error);
      throw new Error('Failed to fetch wedding party member');
    }
  }

  static async reorderWeddingPartyMembers(
    memberIds: string[]
  ): Promise<void> {
    try {
      const updates = memberIds.map((memberId, index) => 
        updateDoc(doc(db, this.WEDDING_PARTY_COLLECTION, memberId), {
          order: index,
          updatedAt: Timestamp.now(),
        })
      );
      
      await Promise.all(updates);
    } catch (error) {
      console.error('Error reordering wedding party members:', error);
      throw new Error('Failed to reorder wedding party members');
    }
  }

  static getWeddingPartyRoleDisplayName(role: WeddingPartyRole): string {
    const roleDisplayNames: Record<WeddingPartyRole, string> = {
      'maid_of_honor': 'Maid of Honor',
      'best_man': 'Best Man',
      'bridesmaid': 'Bridesmaid',
      'groomsman': 'Groomsman',
      'flower_girl': 'Flower Girl',
      'ring_bearer': 'Ring Bearer',
      'officiant': 'Officiant',
      'padrinos_velacion': 'Padrinos de Velación',
      'padrinos_anillos': 'Padrinos de Anillos',
      'padrinos_arras': 'Padrinos de Arras',
      'padrinos_lazo': 'Padrinos de Lazo',
      'padrinos_biblia': 'Padrinos de Biblia',
      'padrinos_cojines': 'Padrinos de Cojines',
      'padrinos_ramo': 'Padrinos de Ramo',
    };
    
    return roleDisplayNames[role] || role;
  }

  static getWeddingPartyRoleIcon(role: WeddingPartyRole): string {
    const roleIcons: Record<WeddingPartyRole, string> = {
      'maid_of_honor': '👰',
      'best_man': '🤵',
      'bridesmaid': '👩‍🤝‍👩',
      'groomsman': '👨‍🤝‍👨',
      'flower_girl': '🌸',
      'ring_bearer': '💍',
      'officiant': '⛪',
      'padrinos_velacion': '🕯️',
      'padrinos_anillos': '💍',
      'padrinos_arras': '💰',
      'padrinos_lazo': '🎀',
      'padrinos_biblia': '📖',
      'padrinos_cojines': '🛏️',
      'padrinos_ramo': '💐',
    };
    
    return roleIcons[role] || '👥';
  }
}
