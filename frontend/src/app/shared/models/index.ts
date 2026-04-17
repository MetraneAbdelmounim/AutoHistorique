// ─── User ───────────────────────────────────────────────────
export interface User {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  role: 'user' | 'admin';
  actif: boolean;
  dernierAcces?: string;
  createdAt: string;
}

// ─── Auth ────────────────────────────────────────────────────
export interface LoginRequest { email: string; password: string; }
export interface RegisterRequest { nom: string; prenom: string; email: string; password: string; }
export interface AuthResponse { success: boolean; token: string; user: User; }

// ─── Vehicle ─────────────────────────────────────────────────
export interface Vehicle {
  _id?: string;
  immatriculation: string;
  marque?: string;
  modele?: string;
  annee?: number;
  couleur?: string;
  typeCarburant?: string;
  createdAt?: string;
}

// ─── Accident ────────────────────────────────────────────────
export type GraviteType = 'leger' | 'modere' | 'grave' | 'total';
export type TypeChoc = 'frontal' | 'arriere' | 'lateral_gauche' | 'lateral_droit' | 'tonneau' | 'multiple';
export type ResponsabiliteType = 'responsable' | 'non_responsable' | 'partage' | 'inconnu';

export interface Accident {
  _id?: string;
  immatriculation: string;
  dateAccident: string;
  gravite: GraviteType;
  typeChoc?: TypeChoc;
  compagnieAssurance: string;
  numeroSinistre?: string;
  montantDommage?: number;
  reparationEffectuee?: boolean;
  dateReparation?: string;
  description?: string;
  lieu?: string;
  responsabilite?: ResponsabiliteType;
  createdAt?: string;
}

// ─── Score confiance ─────────────────────────────────────────
export type ScoreType = 'excellent' | 'faible' | 'moyen' | 'eleve' | 'risque';
export interface ScoreConfiance { score: ScoreType; label: string; value: number; }

// ─── Rapport ─────────────────────────────────────────────────
export interface RapportVehicule {
  success: boolean;
  immatriculation: string;
  type: 'classique' | 'transit';
  vehicule: Vehicle | null;
  nombreAccidents: number;
  scoreConfiance: ScoreConfiance;
  accidents: Accident[];
}

// ─── API Générique ───────────────────────────────────────────
export interface ApiResponse<T = any> { success: boolean; message?: string; data?: T; }
export interface Stats { totalVehicules: number; totalAccidents: number; parGravite: { _id: string; count: number }[]; }
