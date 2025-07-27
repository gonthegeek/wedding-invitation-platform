import type { Guest } from '../types/guest';

export interface GuestCSVData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  relationship?: string;
  plusOnes?: number;
  dietaryRestrictions?: string;
}

export class GuestImportExportService {
  static generateCSVTemplate(): string {
    const headers = [
      'firstName',
      'lastName', 
      'email',
      'phone',
      'relationship',
      'plusOnes',
      'dietaryRestrictions'
    ];
    
    const sampleData = [
      'John,Doe,john.doe@email.com,(555) 123-4567,Friend,1,None',
      'Jane,Smith,jane.smith@email.com,(555) 987-6543,Family,0,Vegetarian',
      'Michael,Johnson,mike.j@email.com,(555) 456-7890,Work,1,Gluten-free'
    ];
    
    return [headers.join(','), ...sampleData].join('\n');
  }

  static downloadCSVTemplate(): void {
    const csvContent = this.generateCSVTemplate();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'guest_list_template.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  static exportGuestsToCSV(guests: Guest[], filename: string = 'guest_list.csv'): void {
    const headers = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'rsvpStatus',
      'attendingCeremony',
      'attendingReception',
      'dietaryRestrictions',
      'specialRequests',
      'remindersSent',
      'invitedAt'
    ];

    const csvData = guests.map(guest => [
      `"${guest.firstName}"`,
      `"${guest.lastName}"`,
      `"${guest.email}"`,
      `"${guest.phone || ''}"`,
      `"${guest.rsvpStatus}"`,
      guest.attendingCeremony || false,
      guest.attendingReception || false,
      `"${guest.dietaryRestrictions || ''}"`,
      `"${guest.specialRequests || ''}"`,
      guest.remindersSent || 0,
      guest.invitedAt ? new Date(guest.invitedAt).toISOString() : ''
    ].join(','));

    const csvContent = [headers.join(','), ...csvData].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  static parseCSV(csvContent: string): GuestCSVData[] {
    const lines = csvContent.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV file must contain at least a header row and one data row');
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const requiredHeaders = ['firstname', 'lastname', 'email'];
    
    // Check for required headers
    const missingHeaders = requiredHeaders.filter(header => 
      !headers.some(h => h.includes(header.toLowerCase()))
    );
    
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
    }

    const guests: GuestCSVData[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue; // Skip empty lines
      
      const values = this.parseCSVLine(line);
      if (values.length !== headers.length) {
        console.warn(`Line ${i + 1} has ${values.length} values but expected ${headers.length}. Skipping.`);
        continue;
      }

      const guest: GuestCSVData = {
        firstName: '',
        lastName: '',
        email: ''
      };

      headers.forEach((header, index) => {
        const value = values[index]?.trim() || '';
        
        switch (header.toLowerCase()) {
          case 'firstname':
          case 'first_name':
          case 'first name':
            guest.firstName = value;
            break;
          case 'lastname':
          case 'last_name':
          case 'last name':
            guest.lastName = value;
            break;
          case 'email':
          case 'email_address':
          case 'email address':
            guest.email = value;
            break;
          case 'phone':
          case 'phone_number':
          case 'phone number':
            guest.phone = value;
            break;
          case 'relationship':
            guest.relationship = value;
            break;
          case 'plusones':
          case 'plus_ones':
          case 'plus ones':
            guest.plusOnes = parseInt(value) || 0;
            break;
          case 'dietaryrestrictions':
          case 'dietary_restrictions':
          case 'dietary restrictions':
          case 'dietary':
            guest.dietaryRestrictions = value;
            break;
        }
      });

      // Validate required fields
      if (!guest.firstName || !guest.lastName || !guest.email) {
        console.warn(`Line ${i + 1} missing required fields (firstName, lastName, email). Skipping.`);
        continue;
      }

      // Validate email format
      if (!this.isValidEmail(guest.email)) {
        console.warn(`Line ${i + 1} has invalid email: ${guest.email}. Skipping.`);
        continue;
      }

      guests.push(guest);
    }

    return guests;
  }

  private static parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++; // Skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result;
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static async importGuestsFromFile(file: File): Promise<GuestCSVData[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const csvContent = e.target?.result as string;
          const guests = this.parseCSV(csvContent);
          resolve(guests);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };
      
      reader.readAsText(file);
    });
  }

  static validateImportData(guests: GuestCSVData[]): { valid: GuestCSVData[], invalid: { guest: GuestCSVData, errors: string[] }[] } {
    const valid: GuestCSVData[] = [];
    const invalid: { guest: GuestCSVData, errors: string[] }[] = [];

    guests.forEach(guest => {
      const errors: string[] = [];

      if (!guest.firstName?.trim()) {
        errors.push('First name is required');
      }
      if (!guest.lastName?.trim()) {
        errors.push('Last name is required');
      }
      if (!guest.email?.trim()) {
        errors.push('Email is required');
      } else if (!this.isValidEmail(guest.email)) {
        errors.push('Invalid email format');
      }
      
      if (guest.plusOnes && (guest.plusOnes < 0 || guest.plusOnes > 10)) {
        errors.push('Plus ones must be between 0 and 10');
      }

      if (errors.length > 0) {
        invalid.push({ guest, errors });
      } else {
        valid.push(guest);
      }
    });

    return { valid, invalid };
  }
}
