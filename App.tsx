import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppMode, FaceRecord, RecognitionMatch, Language } from './types';
import { faceService } from './services/faceService';
import { searchPersonnel, getPersonnelData, PersonnelData, savePersonnelData, calculateAge } from './services/personnelService';
import { DB_KEY } from './constants';
import { Camera } from './components/Camera';
import { FaceCanvas } from './components/FaceCanvas';
import { getTranslation } from './translations';
import logo from './logo.png';
import landingImage from './landing.jpg';


// Icons
const IconScan = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /><circle cx="12" cy="12" r="3" /><path d="M12 16v3" /><path d="M12 8V5" /><path d="M16 12h3" /><path d="M8 12H5" /></svg>;
const IconUserPlus = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>;
const IconDatabase = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /></svg>;
const IconInfo = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>;
const IconGlobe = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z" /></svg>;
const IconCamera = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>;
const IconUpload = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>;
const IconTrash = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1 1 2 2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>;
const IconDownload = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>;
const IconFileImport = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><path d="M12 18v-6" /><path d="M9 15l3 3 3-3" /></svg>;
const IconChip = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" /><line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" /><line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" /></svg>;
const IconWarning = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>;
const IconChevronDown = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>;
const IconChevronUp = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6" /></svg>;
const IconChevronLeft = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>;
const IconChevronRight = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>;
const IconUsers = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
const IconFingerprint = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" /><path d="M25.6 19.33c-.95.48-2.26 1.13-3.6 1.47-2.66.68-4.75 1.2-8 1.2s-5.34-.52-8-1.2c-1.34-.34-2.65-.99-3.6-1.47" /><path d="M12 2a12.86 12.86 0 0 0-6.63 2.54c-1.4 1.12-2.3 2.65-2.2 4.67a6.22 6.22 0 0 1-.58 2.64 8.78 8.78 0 0 1-1.37 2.45" /><path d="M12 2a12.86 12.86 0 0 1 6.63 2.54c1.4 1.12 2.3 2.65 2.2 4.67a6.22 6.22 0 0 0 .58 2.64 8.78 8.78 0 0 0 1.37 2.45" /></svg>;
const IconSearch = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
const IconRefresh = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M3 21v-5h5" /></svg>;
const IconEdit = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
const IconX = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
const IconSave = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>;
const IconSettings = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const IconBook = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>;
const IconShield = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
const IconMoon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>;
const IconSun = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>;
const IconLink = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>;
const IconServerOff = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.03 2l2.97 2.97m17 17L2.03 2" /><path d="M22 12h-6l-3 3h-2l-3-3H2" /><path d="M5.5 12h2" /><path d="M16.5 12h2" /><path d="M9 2h6a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-2l-3-3" /><path d="M6 9H5a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-1" /></svg>;

type RecogMethod = 'camera' | 'upload';

interface EnrollImageItem {
    id: string;
    src: string;
    descriptor: Float32Array | null;
    status: 'processing' | 'valid' | 'invalid';
}

const App: React.FC = () => {
    const [lang, setLang] = useState<Language>('ko');
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const t = getTranslation(lang);

    // Default mode set to RECOGNIZE
    const [mode, setMode] = useState<AppMode>(AppMode.RECOGNIZE);
    const [isLoading, setIsLoading] = useState(true);
    const [database, setDatabase] = useState<FaceRecord[]>([]);

    // Settings State
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [showArchModal, setShowArchModal] = useState(false);
    const [showManualModal, setShowManualModal] = useState(false);
    const [showSecurityModal, setShowSecurityModal] = useState(false);

    // Recognition State
    const [currentDetection, setCurrentDetection] = useState<any>(null);
    const [currentMatch, setCurrentMatch] = useState<RecognitionMatch | null>(null);
    const [recogMethod, setRecogMethod] = useState<RecogMethod>('camera');

    // Enrollment Inputs
    const [enrollName, setEnrollName] = useState('');
    const [enrollTitle, setEnrollTitle] = useState('');
    const [enrollGender, setEnrollGender] = useState('');
    const [enrollBirth, setEnrollBirth] = useState('');
    const [enrollAge, setEnrollAge] = useState('');
    const [enrollError, setEnrollError] = useState('');
    const [suggestions, setSuggestions] = useState<PersonnelData[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Enroll Images State (Batch)
    const [enrollImages, setEnrollImages] = useState<EnrollImageItem[]>([]);

    // Recognition Image Upload State (Single)
    const [uploadedImageSrc, setUploadedImageSrc] = useState<string | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [uploadedImageDims, setUploadedImageDims] = useState<{ width: number, height: number }>({ width: 0, height: 0 });
    const recogFileInputRef = useRef<HTMLInputElement>(null);

    // Database View State
    const [dbTab, setDbTab] = useState<'biometric' | 'personnel'>('biometric');
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
    const [personnelList, setPersonnelList] = useState<PersonnelData[]>([]);
    const [personnelSearch, setPersonnelSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [editingPerson, setEditingPerson] = useState<PersonnelData | null>(null);
    const [showLanding, setShowLanding] = useState(true);
    const ITEMS_PER_PAGE = 50;

    useEffect(() => {
        // Auto-hide landing screen after 5 seconds
        const timer = setTimeout(() => {
            setShowLanding(false);
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const recognitionInterval = useRef<number | null>(null);

    // 1. Initialize System & Theme
    useEffect(() => {
        const init = async () => {
            try {
                await faceService.loadModels();
                loadDatabase();
                setPersonnelList(getPersonnelData()); // Load raw personnel data
                setIsLoading(false);
            } catch (e) {
                console.error("Init failed", e);
                alert("Failed to load models. Refresh.");
            }
        };
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Theme effect
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    // 2. Database Management
    const loadDatabase = () => {
        const stored = localStorage.getItem(DB_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // Hydrate Float32Arrays
                const hydrated: FaceRecord[] = parsed.map((item: any) => ({
                    ...item,
                    descriptor: faceService.deserializeDescriptor(item.descriptor)
                }));
                setDatabase(hydrated);
                faceService.loadFaceMatcher(hydrated);
            } catch (e) {
                console.error("Corrupt DB", e);
            }
        }
    };

    const saveRecordsToDatabase = (newRecords: FaceRecord[]) => {
        const updated = [...database, ...newRecords];
        setDatabase(updated);

        // Serialize for storage
        const serialized = updated.map(item => ({
            ...item,
            descriptor: faceService.serializeDescriptor(item.descriptor)
        }));

        localStorage.setItem(DB_KEY, JSON.stringify(serialized));
        faceService.loadFaceMatcher(updated);
    };

    const deleteRecord = (id: string) => {
        const updated = database.filter(r => r.id !== id);
        setDatabase(updated);
        const serialized = updated.map(item => ({
            ...item,
            descriptor: faceService.serializeDescriptor(item.descriptor)
        }));
        localStorage.setItem(DB_KEY, JSON.stringify(serialized));
        faceService.loadFaceMatcher(updated);
    };

    const handleExportDatabase = () => {
        // Serialize database for download
        const serialized = database.map(item => ({
            ...item,
            descriptor: Array.from(item.descriptor) // Convert Float32Array to regular array
        }));

        const dataStr = JSON.stringify(serialized, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        const date = new Date().toISOString().split('T')[0];
        link.download = `sentinel_backup_${date}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleImportDatabase = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = event.target?.result as string;
                const parsed = JSON.parse(json);

                if (!Array.isArray(parsed)) throw new Error("Invalid Format");

                // Hydrate and validate
                const newRecords: FaceRecord[] = [];

                parsed.forEach((item: any) => {
                    if (item.id && item.name && item.descriptor && Array.isArray(item.descriptor)) {

                        // Check if this person already exists in the CURRENT database OR in the new batch being processed
                        // Criteria: Name + Title + Age
                        const existingInDb = database.find(r =>
                            r.name === item.name &&
                            r.title === item.title &&
                            r.age === item.age
                        );

                        const existingInBatch = newRecords.find(r =>
                            r.name === item.name &&
                            r.title === item.title &&
                            r.age === item.age
                        );

                        // Consolidate personId: Use DB match first, then Batch match, then original/new
                        let finalPersonId = item.personId || crypto.randomUUID();

                        if (existingInDb) {
                            finalPersonId = existingInDb.personId;
                        } else if (existingInBatch) {
                            finalPersonId = existingInBatch.personId;
                        }

                        newRecords.push({
                            ...item,
                            personId: finalPersonId,
                            descriptor: new Float32Array(item.descriptor)
                        });
                    }
                });

                // Filter out records that are already exact duplicates (same image ID)
                const existingIds = new Set(database.map(d => d.id));
                const uniqueNewRecords = newRecords.filter(r => !existingIds.has(r.id));

                if (uniqueNewRecords.length > 0) {
                    saveRecordsToDatabase(uniqueNewRecords);
                    alert(t.database.importSuccess + ` (${uniqueNewRecords.length} new)`);
                } else if (newRecords.length > 0) {
                    alert("No new records imported (all duplicates).");
                } else {
                    alert(t.database.importError);
                }

            } catch (error) {
                console.error("Import failed", error);
                alert(t.database.importError);
            }
            // Reset input
            e.target.value = '';
        };
        reader.readAsText(file);
    };

    // 3. Analysis Loop Logic
    // REMOVED real-time recognitionInterval to prevent flickering. 
    // Analysis is now triggered manually via Capture or Upload.

    // Processing Helper for Enroll Images
    const processEnrollmentImage = async (item: EnrollImageItem) => {
        const img = new Image();
        img.src = item.src;
        img.crossOrigin = "anonymous";
        await img.decode(); // Wait for load

        const result = await faceService.getDescriptorFromImage(img);

        setEnrollImages(prev => prev.map(p => {
            if (p.id !== item.id) return p;
            return {
                ...p,
                descriptor: result ? result.descriptor : null,
                status: result ? 'valid' : 'invalid'
            };
        }));
    };

    // Image Upload Logic
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            // ENROLLMENT MODE: Handle Multiple
            if (mode === AppMode.ENROLL) {
                const newFiles = Array.from(e.target.files).map((file: File) => ({
                    id: crypto.randomUUID(),
                    src: URL.createObjectURL(file),
                    descriptor: null,
                    status: 'processing' as const
                }));

                setEnrollImages(prev => [...prev, ...newFiles]);
                setEnrollError('');

                // Process each new file
                newFiles.forEach(item => {
                    processEnrollmentImage(item);
                });
            }
            // RECOGNITION MODE: Handle Single
            else if (mode === AppMode.RECOGNIZE) {
                const file = e.target.files[0];
                const url = URL.createObjectURL(file);
                setUploadedImageSrc(url);
                setCurrentDetection(null);
                setCurrentMatch(null);
            }
        }
    };

    const handleCapture = async (dataUrl: string) => {
        setCapturedImage(dataUrl);
        const img = new Image();
        img.src = dataUrl;
        await img.decode();

        setUploadedImageDims({ width: img.naturalWidth, height: img.naturalHeight });
        const result = await faceService.getDescriptorFromImage(img);

        if (result) {
            const match = faceService.identifyFace(result.descriptor, database);
            setCurrentMatch(match);
            setCurrentDetection(result.detection);
        } else {
            setCurrentDetection(null);
            setCurrentMatch(null);
        }
    };

    const handleRetake = () => {
        setCapturedImage(null);
        setCurrentDetection(null);
        setCurrentMatch(null);
    };

    const onRecogImageLoad = async (e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.currentTarget;
        setUploadedImageDims({ width: img.naturalWidth, height: img.naturalHeight });

        const result = await faceService.getDescriptorFromImage(img);
        if (result) {
            const match = faceService.identifyFace(result.descriptor, database);
            setCurrentMatch(match);
            setCurrentDetection(result.detection);
        } else {
            setCurrentDetection(null);
            setCurrentMatch(null);
        }
    };

    // 4. Action Handlers
    const handleEnrollNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setEnrollName(val);
        if (val.length > 1) {
            const matches = searchPersonnel(val);
            setSuggestions(matches);
            setShowSuggestions(matches.length > 0);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    // Logic to calculate age from birth year string (e.g., "1980" or "1980년")
    const calculateAgeFromInput = (input: string): string => {
        const match = input.match(/(\d{4})/);
        if (match) {
            const year = parseInt(match[1], 10);
            const currentYear = new Date().getFullYear();
            return (currentYear - year).toString();
        }
        return '';
    };

    // Auto-calculate age when birth field changes
    useEffect(() => {
        if (enrollBirth) {
            const autoAge = calculateAgeFromInput(enrollBirth);
            if (autoAge) setEnrollAge(autoAge);
        }
    }, [enrollBirth]);

    const selectSuggestion = (person: PersonnelData) => {
        setEnrollName(person.name);
        setEnrollTitle(person.role || '');
        setEnrollGender(person.gender || '');
        setEnrollBirth(person.birth || '');
        setEnrollAge(person.calculatedAge || '');
        setShowSuggestions(false);
    };

    const handleEnroll = async () => {
        if (!enrollName.trim() || !enrollTitle.trim()) {
            setEnrollError(t.enroll.errorName);
            return;
        }

        const validImages = enrollImages.filter(img => img.status === 'valid' && img.descriptor);

        if (validImages.length === 0) {
            setEnrollError(t.enroll.errorFace);
            return;
        }

        const unknownLabel = lang === 'ko' ? '미상' : 'Unknown';
        const cName = enrollName.trim();
        const cTitle = enrollTitle.trim() || unknownLabel;
        const cBirth = enrollBirth.trim() || unknownLabel;
        const cAge = enrollAge.trim() || unknownLabel;

        // Check if a person with this Name + Title + Age already exists to group them
        const existingPerson = database.find(
            r => r.name === cName && r.title === cTitle && r.age === cAge
        );

        const personId = existingPerson ? existingPerson.personId : crypto.randomUUID();

        // Process valid images to generate thumbnails and create records
        const newRecords: FaceRecord[] = await Promise.all(validImages.map(async (img) => {
            const thumbnail = await faceService.createThumbnail(img.src);
            return {
                id: crypto.randomUUID(),
                personId: personId,
                name: cName,
                title: cTitle,
                gender: enrollGender.trim() || unknownLabel,
                birth: cBirth,
                age: cAge,
                descriptor: img.descriptor!,
                createdAt: Date.now(),
                previewImage: thumbnail
            };
        }));

        saveRecordsToDatabase(newRecords);

        // Reset form
        setEnrollName('');
        setEnrollTitle('');
        setEnrollGender('');
        setEnrollBirth('');
        setEnrollAge('');
        setEnrollImages([]);
        setEnrollError('');

        alert(t.enroll.success);
    };

    const removeEnrollImage = (id: string) => {
        setEnrollImages(prev => prev.filter(img => img.id !== id));
    };

    const resetView = (newMode: AppMode) => {
        setMode(newMode);
        setUploadedImageSrc(null);
        setCapturedImage(null);
        setCurrentDetection(null);
        setCurrentMatch(null);
        setEnrollImages([]);
        setEnrollError('');
        setSuggestions([]);
        setShowSuggestions(false);
        setIsSettingsOpen(false); // Close settings when switching modes
    };

    const toggleGroup = (personId: string) => {
        const newSet = new Set(expandedGroups);
        if (newSet.has(personId)) {
            newSet.delete(personId);
        } else {
            newSet.add(personId);
        }
        setExpandedGroups(newSet);
    };

    // Personnel Edit Handlers
    const openEditModal = (person: PersonnelData) => {
        setEditingPerson({ ...person });
    };

    const closeEditModal = () => {
        setEditingPerson(null);
    };

    const saveEditedPersonnel = () => {
        if (!editingPerson) return;
        if (!editingPerson.name.trim()) {
            alert("Name is required");
            return;
        }

        // Recalculate age in case birth date changed
        const newAge = calculateAge(editingPerson.birth, editingPerson.deathStatus, editingPerson.deathDate);
        const updatedPerson = {
            ...editingPerson,
            calculatedAge: newAge
        };

        const newList = personnelList.map(p => p.id === updatedPerson.id ? updatedPerson : p);
        setPersonnelList(newList);
        savePersonnelData(newList);
        closeEditModal();
    };


    // Helper to determine match style
    const getConfidenceStyle = (score: number) => {
        if (score >= 90) return {
            label: t.recognize.confidenceLevel.level1,
            color: 'text-green-600 dark:text-green-400',
            bg: 'bg-green-500',
            border: 'border-green-500/50'
        };
        if (score >= 80) return {
            label: t.recognize.confidenceLevel.level2,
            color: 'text-emerald-600 dark:text-emerald-400',
            bg: 'bg-emerald-500',
            border: 'border-emerald-500/50'
        };
        if (score >= 70) return {
            label: t.recognize.confidenceLevel.level3,
            color: 'text-yellow-600 dark:text-yellow-400',
            bg: 'bg-yellow-500',
            border: 'border-yellow-500/50'
        };
        if (score >= 60) return {
            label: t.recognize.confidenceLevel.level4,
            color: 'text-orange-600 dark:text-orange-400',
            bg: 'bg-orange-500',
            border: 'border-orange-500/50'
        };
        return {
            label: t.recognize.confidenceLevel.level5,
            color: 'text-red-600 dark:text-red-400',
            bg: 'bg-red-500',
            border: 'border-red-500/50'
        };
    };

    // Group database records by personId
    const groupedDatabase = React.useMemo(() => {
        const groups: { [key: string]: FaceRecord[] } = {};
        database.forEach(record => {
            // Use id as fallback if personId is missing (legacy)
            const key = record.personId || record.id;
            if (!groups[key]) groups[key] = [];
            groups[key].push(record);
        });
        return groups;
    }, [database]);

    // Filter Personnel List
    const filteredPersonnel = React.useMemo(() => {
        if (!personnelSearch.trim()) return personnelList;
        const lower = personnelSearch.toLowerCase();
        return personnelList.filter(p =>
            p.name.toLowerCase().includes(lower) ||
            p.role.toLowerCase().includes(lower)
        );
    }, [personnelList, personnelSearch]);

    const totalPages = Math.ceil(filteredPersonnel.length / ITEMS_PER_PAGE);
    const currentPersonnel = filteredPersonnel.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Trigger file input for re-upload
    const handleTriggerUpload = () => {
        if (recogFileInputRef.current) {
            recogFileInputRef.current.click();
        }
    };

    // Render Logic
    if (isLoading || showLanding) {
        return (
            <div
                className="fixed inset-0 z-[9999] bg-black flex items-center justify-center cursor-pointer animate-in fade-in duration-700"
                onClick={() => setShowLanding(false)}
            >
                <img
                    src={landingImage}
                    alt="Project PID Landing"
                    className="w-full h-full object-cover lg:object-contain"
                />
                <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-2 animate-bounce">
                    <span className="text-white/60 text-xs font-mono tracking-widest uppercase">Tap to Start</span>
                    <div className="w-1 h-8 bg-gradient-to-b from-cyan-500 to-transparent rounded-full"></div>
                </div>
            </div>
        );
    }

    const validEnrollCount = enrollImages.filter(i => i.status === 'valid').length;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
            {/* Navbar */}
            <nav className="h-16 border-b border-gray-200 dark:border-slate-800 flex items-center px-4 md:px-6 justify-between bg-white/70 dark:bg-slate-950/50 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
                <div className="flex items-center space-x-3">
                    <img
                        src={logo}
                        alt="Sentinel ID"
                        className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(6,182,212,0.5)] hover:scale-105 transition-transform duration-300"
                    />

                    <span className="font-mono font-bold text-lg tracking-wider text-cyan-700 dark:text-cyan-400 hidden sm:block whitespace-nowrap">{t.nav.title}</span>
                </div>

                <div className="flex items-center space-x-2 relative">
                    <div className="flex space-x-1 bg-gray-200/50 dark:bg-slate-800/50 p-1 rounded-lg overflow-x-auto max-w-[240px] sm:max-w-none">
                        <button
                            onClick={() => resetView(AppMode.RECOGNIZE)}
                            className={`px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base font-bold transition-all whitespace-nowrap break-keep ${mode === AppMode.RECOGNIZE ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white'}`}
                        >
                            {t.nav.identify}
                        </button>
                        <button
                            onClick={() => resetView(AppMode.ENROLL)}
                            className={`px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base font-bold transition-all whitespace-nowrap break-keep ${mode === AppMode.ENROLL ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-white'}`}
                        >
                            {t.nav.enroll}
                        </button>
                        <button
                            onClick={() => resetView(AppMode.DATABASE)}
                            className={`px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base font-bold transition-all whitespace-nowrap break-keep ${mode === AppMode.DATABASE ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white'}`}
                        >
                            {t.nav.db}
                        </button>
                    </div>

                    {/* Settings Button (Gear Icon) */}
                    <button
                        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                        className={`flex items-center justify-center w-10 h-10 rounded-md transition-colors border ml-2 ${isSettingsOpen ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white border-slate-300 dark:border-slate-600' : 'bg-gray-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-gray-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                    >
                        <IconSettings />
                    </button>

                    {/* Settings Dropdown */}
                    {isSettingsOpen && (
                        <div className="absolute top-12 right-0 w-72 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-2xl z-[60] flex flex-col p-2 animate-in fade-in slide-in-from-top-2 duration-200">

                            {/* Language Toggle Switch */}
                            <div
                                onClick={() => { setLang(lang === 'en' ? 'ko' : 'en'); }}
                                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors rounded-lg cursor-pointer group"
                            >
                                <span className={`text-sm font-mono transition-colors ${lang === 'ko' ? 'text-cyan-600 dark:text-cyan-400 font-bold' : 'text-slate-400'}`}>{t.nav.langKo}</span>

                                {/* Toggle Track */}
                                <div className={`relative w-12 h-6 rounded-full transition-colors mx-3 ${lang === 'en' ? 'bg-indigo-600' : 'bg-cyan-600'}`}>
                                    {/* Toggle Knob */}
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${lang === 'en' ? 'translate-x-7' : 'translate-x-1'}`}></div>
                                </div>

                                <span className={`text-sm font-mono transition-colors ${lang === 'en' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-400'}`}>{t.nav.langEn}</span>
                            </div>

                            {/* Theme Toggle Switch */}
                            <div
                                onClick={() => { setTheme(theme === 'dark' ? 'light' : 'dark'); }}
                                className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors rounded-lg cursor-pointer group"
                            >
                                <span className={`text-sm font-mono transition-colors flex items-center gap-1 ${theme === 'light' ? 'text-amber-500 font-bold' : 'text-slate-400'}`}>
                                    {theme === 'light' && <IconSun />} {t.nav.themeLight}
                                </span>

                                {/* Toggle Track */}
                                <div className={`relative w-12 h-6 rounded-full transition-colors mx-3 ${theme === 'dark' ? 'bg-slate-700 border border-slate-600' : 'bg-amber-400'}`}>
                                    {/* Toggle Knob */}
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${theme === 'dark' ? 'translate-x-7' : 'translate-x-1'}`}></div>
                                </div>

                                <span className={`text-sm font-mono transition-colors flex items-center gap-1 ${theme === 'dark' ? 'text-slate-200 font-bold' : 'text-slate-400'}`}>
                                    {t.nav.themeDark} {theme === 'dark' && <IconMoon />}
                                </span>
                            </div>

                            <div className="h-px bg-gray-200 dark:bg-slate-800 my-2 mx-2"></div>

                            {/* Operation Manual Trigger */}
                            <button
                                onClick={() => { setShowManualModal(true); setIsSettingsOpen(false); }}
                                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-sm text-left"
                            >
                                <IconBook />
                                <span className="flex-1 font-mono">{t.nav.manual}</span>
                            </button>

                            {/* Security Notice Trigger */}
                            <button
                                onClick={() => { setShowSecurityModal(true); setIsSettingsOpen(false); }}
                                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-sm text-left"
                            >
                                <IconShield />
                                <span className="flex-1 font-mono">{t.nav.security}</span>
                            </button>

                            <div className="h-px bg-gray-200 dark:bg-slate-800 my-1 mx-2"></div>

                            {/* Architecture Modal Trigger */}
                            <button
                                onClick={() => { setShowArchModal(true); setIsSettingsOpen(false); }}
                                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-sm text-left"
                            >
                                <IconInfo />
                                <span className="flex-1 font-mono">{t.nav.arch}</span>
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="flex-1 p-4 md:p-6 flex flex-col items-center">

                {/* ENROLLMENT VIEW (MULTI UPLOAD) */}
                {mode === AppMode.ENROLL && (
                    <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold flex items-center space-x-2 break-keep text-slate-800 dark:text-slate-100">
                                <IconUserPlus />
                                <span>{t.enroll.title}</span>
                            </h2>

                            <p className="text-slate-500 dark:text-slate-400 text-sm break-keep leading-relaxed">{t.enroll.instruction}</p>

                            {/* Batch Upload Area */}
                            <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-4 border border-gray-200 dark:border-slate-700 min-h-[300px] flex flex-col shadow-lg dark:shadow-none transition-colors">
                                {/* Gallery Grid */}
                                <div className="flex-1 grid grid-cols-3 gap-2 auto-rows-min mb-4 max-h-[400px] overflow-y-auto">
                                    {enrollImages.map((img) => (
                                        <div
                                            key={img.id}
                                            className={`relative aspect-square rounded-lg overflow-hidden border-2 group ${img.status === 'valid' ? 'border-green-500' :
                                                img.status === 'invalid' ? 'border-red-500 opacity-60' : 'border-slate-300 dark:border-slate-600 animate-pulse'
                                                }`}
                                        >
                                            <img src={img.src} alt="thumb" className="w-full h-full object-cover" />
                                            <button
                                                onClick={() => removeEnrollImage(img.id)}
                                                className="absolute top-1 right-1 bg-black/60 p-1 rounded-full text-white hover:bg-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                <IconTrash />
                                            </button>
                                        </div>
                                    ))}

                                    {/* Add Button */}
                                    <label className="aspect-square flex flex-col items-center justify-center border-2 border-gray-300 dark:border-slate-700 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:border-cyan-500/50 transition-all">
                                        <IconUpload />
                                        <span className="text-xs text-slate-500 mt-2 text-center px-1 break-keep">{t.enroll.uploadLabel}</span>
                                        <input type="file" multiple accept="image/png, image/jpeg" className="hidden" onChange={handleImageUpload} />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col justify-center space-y-4 bg-white/50 dark:bg-slate-800/30 p-8 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-xl dark:shadow-none transition-colors">
                            {/* Name Input with Autocomplete */}
                            <div className="space-y-1 relative">
                                <label className="text-xs font-mono text-slate-500 uppercase">{t.enroll.labelName}</label>
                                <input
                                    type="text"
                                    value={enrollName}
                                    onChange={handleEnrollNameChange}
                                    onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                                    placeholder={t.enroll.placeholderName}
                                    className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                />

                                {/* Suggestions Dropdown */}
                                {showSuggestions && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                                        {suggestions.map((person) => (
                                            <button
                                                key={person.id}
                                                onClick={() => selectSuggestion(person)}
                                                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 border-b border-gray-100 dark:border-slate-700/50 last:border-0 transition-colors flex flex-col"
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span className="font-bold text-cyan-600 dark:text-cyan-400">{person.name}</span>
                                                    <span className="text-xs text-slate-500 font-mono">{person.calculatedAge}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-slate-600 dark:text-slate-300 truncate pr-2">{person.role}</span>
                                                    <span className={person.deathStatus ? "text-red-500 dark:text-red-400" : "text-green-600 dark:text-green-400"}>
                                                        {person.deathStatus || "Active"}
                                                    </span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Title Input */}
                            <div className="space-y-1">
                                <label className="text-xs font-mono text-slate-500 uppercase">{t.enroll.labelTitle}</label>
                                <input
                                    type="text"
                                    value={enrollTitle}
                                    onChange={(e) => setEnrollTitle(e.target.value)}
                                    placeholder={t.enroll.placeholderTitle}
                                    className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                />
                            </div>

                            {/* Gender and Birth Row - Responsive */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Gender Input */}
                                <div className="space-y-1">
                                    <label className="text-xs font-mono text-slate-500 uppercase">{t.enroll.labelGender}</label>
                                    <input
                                        type="text"
                                        value={enrollGender}
                                        onChange={(e) => setEnrollGender(e.target.value)}
                                        placeholder={t.enroll.placeholderGender}
                                        className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                    />
                                </div>

                                {/* Birth Input */}
                                <div className="space-y-1">
                                    <label className="text-xs font-mono text-slate-500 uppercase">{t.enroll.labelBirth}</label>
                                    <input
                                        type="text"
                                        value={enrollBirth}
                                        onChange={(e) => setEnrollBirth(e.target.value)}
                                        placeholder={t.enroll.placeholderBirth}
                                        className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Age Input */}
                            <div className="space-y-1">
                                <label className="text-xs font-mono text-slate-500 uppercase">{t.enroll.labelAge}</label>
                                <input
                                    type="text"
                                    value={enrollAge}
                                    onChange={(e) => setEnrollAge(e.target.value)}
                                    placeholder={t.enroll.placeholderAge}
                                    className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                />
                            </div>

                            <div className="space-y-4 pt-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500 dark:text-slate-400 break-keep">{t.enroll.quality}</span>
                                    <span className={validEnrollCount > 0 ? "text-green-600 dark:text-green-400 font-bold" : "text-slate-600"}>
                                        {validEnrollCount > 0 ? t.enroll.validCount.replace('{count}', validEnrollCount.toString()) : t.enroll.waiting}
                                    </span>
                                </div>
                                {/* Visualizer Bar */}
                                <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-green-500 transition-all duration-300"
                                        style={{ width: enrollImages.length > 0 ? `${(validEnrollCount / enrollImages.length) * 100}%` : '0%' }}
                                    ></div>
                                </div>
                            </div>

                            {enrollError && <p className="text-red-500 dark:text-red-400 text-sm break-keep">{enrollError}</p>}

                            <button
                                onClick={handleEnroll}
                                disabled={validEnrollCount === 0}
                                className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-300 dark:disabled:bg-slate-700 disabled:text-gray-500 dark:disabled:text-slate-500 text-white rounded-xl font-bold tracking-wide transition-all shadow-lg shadow-cyan-900/20 break-keep"
                            >
                                {t.enroll.save}
                            </button>
                        </div>
                    </div>
                )}

                {/* RECOGNITION VIEW (CAMERA OR UPLOAD) */}
                {mode === AppMode.RECOGNIZE && (
                    <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in zoom-in-95 duration-500">
                        <div className="lg:col-span-2 space-y-4">
                            <div className="flex justify-between items-end">
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold flex items-center space-x-2 break-keep text-slate-800 dark:text-slate-100">
                                        <IconScan />
                                        <span>{t.recognize.title}</span>
                                    </h2>
                                    {/* Method Switcher for Recognition */}
                                    <div className="flex bg-white dark:bg-slate-800 p-1 rounded-lg w-fit border border-gray-200 dark:border-slate-700 shadow-sm">
                                        <button
                                            onClick={() => { setRecogMethod('camera'); setUploadedImageSrc(null); setCurrentDetection(null); setCurrentMatch(null); }}
                                            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm transition-all break-keep ${recogMethod === 'camera' ? 'bg-gray-100 dark:bg-slate-700 text-slate-900 dark:text-white shadow' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                                        >
                                            <IconCamera />
                                            <span>{t.recognize.modeCamera}</span>
                                        </button>
                                        <button
                                            onClick={() => { setRecogMethod('upload'); setCurrentDetection(null); setCurrentMatch(null); }}
                                            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm transition-all break-keep ${recogMethod === 'upload' ? 'bg-gray-100 dark:bg-slate-700 text-slate-900 dark:text-white shadow' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                                        >
                                            <IconUpload />
                                            <span>{t.recognize.modeUpload}</span>
                                        </button>
                                    </div>
                                </div>
                                {currentMatch && (
                                    <div className="flex items-center space-x-2 px-3 py-1 bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-500/30 rounded-lg animate-pulse">
                                        <span className="w-2 h-2 bg-cyan-500 dark:bg-cyan-400 rounded-full"></span>
                                        <span className="font-mono text-cyan-600 dark:text-cyan-400 text-sm break-keep tracking-widest">{t.recognize.matchFound}</span>
                                    </div>
                                )}
                            </div>

                            <div className={`relative min-h-[300px] sm:min-h-[480px] rounded-2xl overflow-hidden flex items-center justify-center shadow-2xl transition-colors duration-300 ${recogMethod === 'camera' ? 'bg-black' : 'bg-gray-100 dark:bg-slate-900'} ${(recogMethod === 'upload' && !uploadedImageSrc) ? '' : 'border border-gray-200 dark:border-slate-700'}`}>
                                {recogMethod === 'camera' ? (
                                    <div className="relative w-full h-full flex items-center justify-center">
                                        {!capturedImage ? (
                                            <>
                                                <Camera
                                                    isActive={mode === AppMode.RECOGNIZE && recogMethod === 'camera'}
                                                    onVideoReady={(v) => { videoRef.current = v; }}
                                                    onCapture={handleCapture}
                                                />
                                                {/* Scanning Effect Overlay */}
                                                <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
                                                    <div className="w-full h-1 bg-cyan-500/50 blur-sm absolute top-0 animate-[scan_3s_linear_infinite]"></div>
                                                </div>
                                                <style>{`
                                                    @keyframes scan {
                                                        0% { top: 0%; opacity: 0; }
                                                        10% { opacity: 1; }
                                                        90% { opacity: 1; }
                                                        100% { top: 100%; opacity: 0; }
                                                    }
                                                `}</style>
                                            </>
                                        ) : (
                                            <div className="relative w-full h-full group">
                                                <img
                                                    src={capturedImage}
                                                    alt="Captured"
                                                    className="w-full h-full object-contain max-h-[480px]"
                                                />
                                                {/* Retake Button Overlay */}
                                                <div
                                                    onClick={handleRetake}
                                                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer backdrop-blur-sm"
                                                >
                                                    <IconRefresh />
                                                    <span className="mt-2 text-sm font-bold text-white tracking-wider uppercase">{t.recognize.retake || 'RETAKE'}</span>
                                                </div>

                                                {uploadedImageDims.width > 0 && (
                                                    <FaceCanvas
                                                        detection={currentDetection}
                                                        label={currentMatch ? `${currentMatch.name} (${Math.round(currentMatch.similarity)}%)` : (currentDetection ? t.recognize.unknown : undefined)}
                                                        color={currentMatch ? '#06b6d4' : '#ef4444'}
                                                        width={uploadedImageDims.width}
                                                        height={uploadedImageDims.height}
                                                        mirror={false}
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    // Recognition Image Upload with Click-to-Change
                                    <div className="w-full h-full flex flex-col items-center justify-center">
                                        {!uploadedImageSrc ? (
                                            <label className="relative cursor-pointer flex flex-col items-center justify-center w-full h-full border-2 border-gray-300 dark:border-slate-700 border-dashed rounded-2xl hover:bg-gray-200 dark:hover:bg-slate-800/50 hover:border-indigo-500/50 transition-all group overflow-hidden p-8">
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-48 h-48 text-gray-300 dark:text-slate-700/50 transition-colors group-hover:text-gray-400 dark:group-hover:text-slate-600/50">
                                                        <path d="M12 4a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4" />
                                                    </svg>
                                                </div>
                                                <div className="relative z-10 flex flex-col items-center">
                                                    <div className="p-4 bg-white/80 dark:bg-slate-800/80 rounded-full mb-3 group-hover:scale-110 transition-transform backdrop-blur-sm border border-gray-200 dark:border-slate-700 shadow-sm">
                                                        <IconUpload />
                                                    </div>
                                                    <span className="font-semibold text-slate-500 dark:text-slate-300 bg-white/50 dark:bg-slate-900/50 px-3 py-1 rounded-full break-keep">{t.recognize.uploadLabel}</span>
                                                </div>
                                                <input ref={recogFileInputRef} type="file" accept="image/png, image/jpeg" className="hidden" onChange={handleImageUpload} />
                                            </label>
                                        ) : (
                                            <div className="relative w-full h-full group">
                                                <img
                                                    src={uploadedImageSrc}
                                                    alt="Upload"
                                                    onLoad={onRecogImageLoad}
                                                    className="w-full h-full object-contain max-h-[480px]"
                                                />
                                                {/* Hover Overlay for Changing Image */}
                                                <div
                                                    onClick={handleTriggerUpload}
                                                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer backdrop-blur-sm"
                                                >
                                                    <IconEdit />
                                                    <span className="mt-2 text-sm font-bold text-white tracking-wider">CHANGE IMAGE</span>
                                                </div>
                                                {/* Hidden input triggered by overlay click */}
                                                <input ref={recogFileInputRef} type="file" accept="image/png, image/jpeg" className="hidden" onChange={handleImageUpload} />

                                                {uploadedImageDims.width > 0 && (
                                                    <FaceCanvas
                                                        detection={currentDetection}
                                                        label={currentMatch ? `${currentMatch.name} (${Math.round(currentMatch.similarity)}%)` : (currentDetection ? t.recognize.unknown : undefined)}
                                                        color={currentMatch ? '#06b6d4' : '#ef4444'}
                                                        width={uploadedImageDims.width}
                                                        height={uploadedImageDims.height}
                                                        mirror={false}
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Analysis Panel */}
                        <div className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-md border border-gray-200 dark:border-slate-700/50 rounded-2xl p-6 flex flex-col h-full shadow-xl relative overflow-hidden transition-colors">
                            {/* Decorative background grid */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

                            <h3 className="font-mono text-slate-500 uppercase text-xs mb-6 break-keep flex items-center gap-2 relative z-10">
                                <IconChip />
                                {t.recognize.analysisTitle}
                            </h3>

                            {currentMatch ? (
                                (() => {
                                    const style = getConfidenceStyle(currentMatch.similarity);
                                    return (
                                        <div className="flex-1 flex flex-col space-y-6 relative z-10 animate-in slide-in-from-right-4 duration-300">
                                            <div className={`text-center p-6 bg-gray-50 dark:bg-slate-900/60 rounded-xl border-t-2 ${style.border} shadow-lg backdrop-blur-sm`}>
                                                {/* Improved Face Preview in Recognition Panel */}
                                                <div className={`w-28 h-28 bg-gray-200 dark:bg-slate-800 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-slate-500 overflow-hidden border-4 ${style.border} shadow-2xl`}>
                                                    {database.find(r => r.id === currentMatch.recordId)?.previewImage ? (
                                                        <img
                                                            src={database.find(r => r.id === currentMatch.recordId)?.previewImage}
                                                            alt={currentMatch.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        currentMatch.name.charAt(0)
                                                    )}
                                                </div>
                                                <h2 className="text-2xl font-bold text-slate-800 dark:text-white break-keep tracking-tight">{currentMatch.name}</h2>
                                                <p className="text-xs font-mono text-cyan-600 dark:text-cyan-400 mt-1 uppercase tracking-widest">{style.label}</p>

                                                {/* New Confidence Bar UI */}
                                                <div className="w-full mt-6 mb-2 px-2">
                                                    <div className="flex justify-between items-end mb-2 font-mono">
                                                        <span className="text-xs text-slate-500 dark:text-slate-400">ACCURACY</span>
                                                        <span className={`text-sm font-bold ${style.color}`}>{currentMatch.similarity.toFixed(1)}%</span>
                                                    </div>
                                                    <div className="h-3 bg-gray-200 dark:bg-slate-800 rounded-sm overflow-hidden border border-gray-300 dark:border-slate-700">
                                                        <div
                                                            className={`h-full ${style.bg} transition-all duration-700 ease-out`}
                                                            style={{ width: `${currentMatch.similarity}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Stored Identity Details Card */}
                                            <div className="bg-white/80 dark:bg-slate-900/40 border border-gray-200 dark:border-slate-700/50 rounded-lg p-4 grid grid-cols-1 gap-4 text-left">
                                                <div className="flex justify-between items-center border-b border-gray-200 dark:border-slate-800/50 pb-2">
                                                    <span className="text-xs font-mono text-slate-500 uppercase">{t.enroll.labelTitle}</span>
                                                    <span className="text-sm font-bold font-mono text-slate-700 dark:text-slate-200 text-right">{currentMatch.title}</span>
                                                </div>
                                                <div className="flex justify-between items-center border-b border-gray-200 dark:border-slate-800/50 pb-2">
                                                    <span className="text-xs font-mono text-slate-500 uppercase">{t.enroll.labelAge}</span>
                                                    <span className="text-sm font-bold font-mono text-slate-700 dark:text-slate-200 text-right">{currentMatch.age}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs font-mono text-slate-500 uppercase">{t.enroll.labelGender}</span>
                                                    <span className="text-sm font-bold font-mono text-slate-700 dark:text-slate-200 text-right">{currentMatch.gender || (lang === 'ko' ? '미상' : 'Unknown')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()
                            ) : currentDetection ? (
                                // Face Detected but No Match Found (Unidentified)
                                <div className="flex-1 flex flex-col items-center justify-center text-red-500 space-y-6 relative z-10">
                                    <div className="p-6 bg-red-500/5 rounded-full animate-[pulse_2s_infinite] border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                                        <IconWarning />
                                    </div>
                                    <div className="text-center space-y-2">
                                        <h2 className="text-xl font-bold font-mono tracking-[0.2em] break-keep text-red-600 dark:text-red-500">{t.recognize.noMatch}</h2>
                                        <p className="text-xs font-mono text-red-500/80 dark:text-red-400/60 break-keep max-w-[200px] mx-auto">{t.recognize.noMatchDesc}</p>
                                    </div>

                                    <div className="w-full max-w-[240px] bg-red-50 dark:bg-slate-900/50 p-4 rounded-xl border border-red-200 dark:border-red-900/30">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-mono text-red-500 dark:text-red-400">MATCH PROBABILITY</span>
                                            <span className="text-xs font-mono text-red-600 dark:text-red-400 font-bold">0.0%</span>
                                        </div>
                                        <div className="h-2 bg-red-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-red-600 w-0"></div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-slate-500 dark:text-slate-600 space-y-4 relative z-10">
                                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center animate-[spin_10s_linear_infinite]">
                                        <IconScan />
                                    </div>
                                    <p className="text-xs font-mono tracking-widest animate-pulse break-keep">{t.recognize.scanning}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* DATABASE VIEW - GROUPED OR PERSONNEL */}
                {mode === AppMode.DATABASE && (
                    <div className="w-full max-w-5xl space-y-6 animate-in fade-in duration-500">

                        {/* Header & Export Actions */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <h2 className="text-2xl font-bold flex items-center space-x-2 break-keep text-slate-800 dark:text-slate-100">
                                <IconDatabase />
                                <span>{t.database.title}</span>
                            </h2>

                            {dbTab === 'biometric' && (
                                <div className="flex space-x-2 w-full sm:w-auto">
                                    <button
                                        onClick={handleExportDatabase}
                                        className="flex-1 sm:flex-none flex items-center justify-center space-x-1 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors border border-gray-300 dark:border-slate-700 text-sm font-mono break-keep"
                                    >
                                        <IconDownload />
                                        <span>{t.database.export}</span>
                                    </button>
                                    <label className="flex-1 sm:flex-none flex items-center justify-center space-x-1 px-3 py-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-100 dark:hover:bg-cyan-800/50 transition-colors border border-cyan-200 dark:border-cyan-800/50 text-sm font-mono cursor-pointer break-keep">
                                        <IconFileImport />
                                        <span>{t.database.import}</span>
                                        <input type="file" accept="application/json" onChange={handleImportDatabase} className="hidden" />
                                    </label>
                                </div>
                            )}
                        </div>

                        {/* Tab Switcher */}
                        <div className="flex bg-white dark:bg-slate-800/50 p-1 rounded-lg w-full sm:w-fit border border-gray-200 dark:border-transparent">
                            <button
                                onClick={() => setDbTab('biometric')}
                                className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm transition-all font-medium whitespace-nowrap break-keep ${dbTab === 'biometric' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                            >
                                <IconFingerprint />
                                <span>{t.database.tabBiometric}</span>
                            </button>
                            <button
                                onClick={() => setDbTab('personnel')}
                                className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm transition-all font-medium whitespace-nowrap break-keep ${dbTab === 'personnel' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                            >
                                <IconUsers />
                                <span>{t.database.tabPersonnel}</span>
                            </button>
                        </div>

                        {/* Tab Content: Biometric */}
                        {dbTab === 'biometric' && (
                            <div className="space-y-4">
                                <div className="text-slate-500 text-xs font-mono mb-2 break-keep">
                                    {Object.keys(groupedDatabase).length} Groups, {database.length} {t.database.records}
                                </div>

                                {Object.keys(groupedDatabase).length === 0 && (
                                    <div className="py-12 text-center text-slate-500 bg-white/50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-gray-300 dark:border-slate-700 break-keep">
                                        {t.database.empty}
                                    </div>
                                )}

                                {(Object.entries(groupedDatabase) as [string, FaceRecord[]][]).map(([personId, records]) => {
                                    const primary = records[records.length - 1]; // Use latest record for group info
                                    const isExpanded = expandedGroups.has(personId);

                                    return (
                                        <div key={personId} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm dark:shadow-none">
                                            {/* Group Header */}
                                            <button
                                                onClick={() => toggleGroup(personId)}
                                                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors text-left"
                                            >
                                                <div className="flex items-center space-x-4 min-w-0">
                                                    <div className="w-12 h-12 flex-shrink-0 bg-gray-200 dark:bg-slate-700 rounded-full flex items-center justify-center font-bold text-slate-500 dark:text-slate-300 overflow-hidden border border-gray-300 dark:border-slate-600">
                                                        {primary.previewImage ? (
                                                            <img src={primary.previewImage} alt={primary.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            primary.name.charAt(0)
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="font-bold text-slate-800 dark:text-white text-lg truncate break-keep">{primary.name}</h3>
                                                            <span className="text-xs bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-200 dark:border-cyan-800">
                                                                {records.length} {t.database.vectors}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate mt-1">
                                                            {primary.title} • {primary.age} • {primary.gender}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-slate-400 dark:text-slate-500">
                                                    {isExpanded ? <IconChevronUp /> : <IconChevronDown />}
                                                </div>
                                            </button>

                                            {/* Expanded Records (Tree Leaf Nodes) */}
                                            {isExpanded && (
                                                <div className="bg-gray-50 dark:bg-slate-900/50 border-t border-gray-200 dark:border-slate-700 p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 animate-in slide-in-from-top-2 duration-200">
                                                    {records.map(record => (
                                                        <div key={record.id} className="relative group aspect-square bg-black rounded-lg overflow-hidden border border-slate-800">
                                                            {record.previewImage ? (
                                                                <img src={record.previewImage} alt="Vector Thumbnail" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-slate-700">{t.database.noImg}</div>
                                                            )}
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                                                                <span className="text-[10px] font-mono text-slate-400">
                                                                    {new Date(record.createdAt).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); deleteRecord(record.id); }}
                                                                className="absolute top-1 right-1 bg-red-900/80 p-1.5 rounded text-white opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all"
                                                                title={t.database.deleteVector}
                                                            >
                                                                <IconTrash />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Tab Content: Personnel */}
                        {dbTab === 'personnel' && (
                            <div className="space-y-4">
                                {/* Search Bar */}
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                                        <IconSearch />
                                    </div>
                                    <input
                                        type="text"
                                        value={personnelSearch}
                                        onChange={(e) => { setPersonnelSearch(e.target.value); setCurrentPage(1); }}
                                        placeholder={t.database.searchPlaceholder}
                                        className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                    />
                                </div>

                                <div className="text-slate-500 text-xs font-mono break-keep">
                                    {t.database.totalPersonnel}: {filteredPersonnel.length}
                                </div>

                                {/* Table Container */}
                                <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden overflow-x-auto shadow-sm dark:shadow-none">
                                    <table className="w-full text-left text-sm whitespace-nowrap">
                                        <thead className="bg-gray-50 dark:bg-slate-900/50 border-b border-gray-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-mono text-xs uppercase">
                                            <tr>
                                                <th className="px-4 py-3 break-keep">{t.database.colName}</th>
                                                <th className="px-4 py-3 break-keep">{t.database.colAge}</th>
                                                <th className="px-4 py-3 break-keep">{t.database.colRole}</th>
                                                <th className="px-4 py-3 break-keep">{t.database.colBirth}</th>
                                                <th className="px-4 py-3 break-keep">{t.database.colDeath}</th>
                                                <th className="px-4 py-3 break-keep text-right">{t.database.colAction}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-slate-700/50">
                                            {currentPersonnel.map((p) => {
                                                // Custom rendering logic for Age column based on user request
                                                let ageDisplay = p.calculatedAge;
                                                let statusClass = "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/30";

                                                if (p.deathStatus && p.deathStatus.includes("사망")) {
                                                    ageDisplay = lang === 'ko' ? "사망" : "Deceased";
                                                    statusClass = "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/30";
                                                } else if (!p.birth || p.birth.includes("미상") || p.birth === "") {
                                                    ageDisplay = lang === 'ko' ? "미상" : "Unknown";
                                                    statusClass = "bg-gray-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 border-gray-200 dark:border-slate-600/50";
                                                }

                                                return (
                                                    <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                                                        <td className="px-4 py-3 font-semibold text-slate-800 dark:text-white">{p.name}</td>
                                                        <td className="px-4 py-3">
                                                            <span className={`px-2 py-1 rounded-full text-xs border ${statusClass}`}>
                                                                {ageDisplay}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{p.role}</td>
                                                        <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{p.birth || "-"}</td>
                                                        <td className="px-4 py-3 text-slate-400 dark:text-slate-500">{p.deathDate && p.deathDate !== "연도미상" ? p.deathDate : "-"}</td>
                                                        <td className="px-4 py-3 text-right">
                                                            <button
                                                                onClick={() => openEditModal(p)}
                                                                className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-gray-100 dark:hover:bg-slate-600/50 transition-colors"
                                                                title={t.database.edit}
                                                            >
                                                                <IconEdit />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>

                                    {/* Pagination Controls */}
                                    {filteredPersonnel.length > 0 ? (
                                        <div className="p-4 border-t border-gray-200 dark:border-slate-700/50 flex items-center justify-between">
                                            <button
                                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                disabled={currentPage === 1}
                                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-800 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <IconChevronLeft />
                                            </button>
                                            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                                                Page <span className="text-slate-800 dark:text-white">{currentPage}</span> of <span className="text-slate-800 dark:text-white">{totalPages}</span>
                                            </span>
                                            <button
                                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                                disabled={currentPage === totalPages}
                                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-800 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <IconChevronRight />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center text-slate-500 break-keep">{t.database.noPersonnel}</div>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>
                )}

            </main>

            {/* MANUAL MODAL */}
            {showManualModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
                        <div className="p-6 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center bg-gray-50 dark:bg-slate-950/50">
                            <h2 className="text-2xl font-bold flex items-center space-x-2 break-keep text-slate-800 dark:text-white">
                                <IconBook />
                                <span>{t.manual.title}</span>
                            </h2>
                            <button onClick={() => setShowManualModal(false)} className="text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors p-1">
                                <IconX />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-8 text-slate-700 dark:text-slate-300">
                            {/* Overview Section */}
                            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 mb-2">
                                <h4 className="font-bold text-slate-800 dark:text-white mb-3 text-lg flex items-center gap-2">
                                    <span className="w-1.5 h-6 bg-cyan-600 rounded-full"></span>
                                    {t.manual.overviewTitle}
                                </h4>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">
                                    {t.manual.overviewDesc}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700">
                                    <h4 className="font-bold text-cyan-600 dark:text-cyan-400 mb-2 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-cyan-600 dark:bg-cyan-400"></span>
                                        {t.manual.sec1Title}
                                    </h4>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{t.manual.sec1Desc}</p>
                                </div>

                                <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700">
                                    <h4 className="font-bold text-indigo-600 dark:text-indigo-400 mb-2 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
                                        {t.manual.sec2Title}
                                    </h4>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{t.manual.sec2Desc}</p>
                                </div>

                                <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-slate-700 md:col-span-2">
                                    <h4 className="font-bold text-green-600 dark:text-green-400 mb-2 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-600 dark:bg-green-400"></span>
                                        {t.manual.sec3Title}
                                    </h4>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{t.manual.sec3Desc}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* SECURITY MODAL */}
            {showSecurityModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
                        <div className="p-6 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center bg-gray-50 dark:bg-slate-950/50">
                            <h2 className="text-2xl font-bold flex items-center space-x-2 break-keep text-red-600 dark:text-red-500">
                                <IconShield />
                                <span>{t.security.title}</span>
                            </h2>
                            <button onClick={() => setShowSecurityModal(false)} className="text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors p-1">
                                <IconX />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto space-y-6">
                            {/* Section 1: Security Disclaimer */}
                            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-500/30 p-6 rounded-xl">
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-lg">
                                        <IconWarning />
                                        <h3>{t.security.sec1Title}</h3>
                                    </div>
                                    <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed pl-1">
                                        {t.security.sec1Desc}
                                    </p>
                                </div>
                            </div>

                            {/* Section 2: Data Source */}
                            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-6 rounded-xl">
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-2 text-slate-800 dark:text-white font-bold text-lg">
                                        <IconLink />
                                        <h3>{t.security.sec2Title}</h3>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed pl-1">
                                        {t.security.sec2Desc}
                                    </p>
                                </div>
                            </div>

                            {/* Section 3: Architecture */}
                            <div className="bg-cyan-50 dark:bg-cyan-900/10 border border-cyan-200 dark:border-cyan-500/30 p-6 rounded-xl">
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-400 font-bold text-lg">
                                        <IconServerOff />
                                        <h3>{t.security.sec3Title}</h3>
                                    </div>
                                    <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed pl-1">
                                        {t.security.sec3Desc}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ARCHITECTURE MODAL */}
            {showArchModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
                        <div className="p-6 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center bg-gray-50 dark:bg-slate-950/50">
                            <h2 className="text-2xl font-bold flex items-center space-x-2 break-keep text-slate-800 dark:text-white">
                                <IconInfo />
                                <span>{t.about.title}</span>
                            </h2>
                            <button onClick={() => setShowArchModal(false)} className="text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors p-1">
                                <IconX />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-8">
                            {/* Text Diagram Container */}
                            <div className="bg-slate-900 dark:bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl overflow-x-auto">
                                <pre className="font-mono text-xs sm:text-sm leading-relaxed text-cyan-400 whitespace-pre">
                                    {t.about.diagram}
                                </pre>
                            </div>

                            {/* Unified Technical Specifications Box */}
                            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-xl text-slate-700 dark:text-slate-300">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 break-keep">
                                    <IconChip />
                                    <span>{t.about.techHeader}</span>
                                </h3>

                                <div className="space-y-8">
                                    <div>
                                        <h4 className="font-bold text-cyan-600 dark:text-cyan-400 mb-2 flex items-center gap-2 break-keep">
                                            <span className="w-2 h-2 rounded-full bg-cyan-600 dark:bg-cyan-400"></span>
                                            {t.about.tech1Title}
                                        </h4>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed pl-4 border-l-2 border-gray-300 dark:border-slate-700/50 break-keep">
                                            {t.about.tech1Desc}
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-indigo-600 dark:text-indigo-400 mb-2 flex items-center gap-2 break-keep">
                                            <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
                                            {t.about.tech2Title}
                                        </h4>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed pl-4 border-l-2 border-gray-300 dark:border-slate-700/50 break-keep">
                                            {t.about.tech2Desc}
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-green-600 dark:text-green-400 mb-2 flex items-center gap-2 break-keep">
                                            <span className="w-2 h-2 rounded-full bg-green-600 dark:bg-green-400"></span>
                                            {t.about.tech3Title}
                                        </h4>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed pl-4 border-l-2 border-gray-300 dark:border-slate-700/50 break-keep">
                                            {t.about.tech3Desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* EDIT MODAL */}
            {editingPerson && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center bg-gray-50 dark:bg-slate-950/50">
                            <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                                <IconEdit />
                                {t.database.editTitle}
                            </h3>
                            <button onClick={closeEditModal} className="text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
                                <IconX />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Name */}
                            <div className="space-y-1">
                                <label className="text-xs font-mono text-slate-500 uppercase">{t.enroll.labelName}</label>
                                <input
                                    type="text"
                                    value={editingPerson.name}
                                    onChange={(e) => setEditingPerson({ ...editingPerson, name: e.target.value })}
                                    className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                />
                            </div>

                            {/* Role */}
                            <div className="space-y-1">
                                <label className="text-xs font-mono text-slate-500 uppercase">{t.enroll.labelTitle}</label>
                                <input
                                    type="text"
                                    value={editingPerson.role}
                                    onChange={(e) => setEditingPerson({ ...editingPerson, role: e.target.value })}
                                    className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                />
                            </div>

                            {/* Gender & Birth */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-mono text-slate-500 uppercase">{t.enroll.labelGender}</label>
                                    <input
                                        type="text"
                                        value={editingPerson.gender}
                                        onChange={(e) => setEditingPerson({ ...editingPerson, gender: e.target.value })}
                                        className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-mono text-slate-500 uppercase">{t.enroll.labelBirth}</label>
                                    <input
                                        type="text"
                                        value={editingPerson.birth}
                                        onChange={(e) => setEditingPerson({ ...editingPerson, birth: e.target.value })}
                                        className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Death Status */}
                            <div className="space-y-1">
                                <label className="text-xs font-mono text-slate-500 uppercase">{t.database.editStatus}</label>
                                <select
                                    value={editingPerson.deathStatus ? "deceased" : "alive"}
                                    onChange={(e) => {
                                        const isDeceased = e.target.value === 'deceased';
                                        setEditingPerson({
                                            ...editingPerson,
                                            deathStatus: isDeceased ? "사망" : ""
                                        });
                                    }}
                                    className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                >
                                    <option value="alive">Active (Alive)</option>
                                    <option value="deceased">Deceased (사망)</option>
                                </select>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 dark:bg-slate-950/50 border-t border-gray-200 dark:border-slate-800 flex justify-end gap-2">
                            <button
                                onClick={closeEditModal}
                                className="px-4 py-2 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors text-sm font-bold"
                            >
                                {t.database.cancel}
                            </button>
                            <button
                                onClick={saveEditedPersonnel}
                                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/20 transition-all text-sm font-bold flex items-center gap-2"
                            >
                                <IconSave />
                                {t.database.saveChanges}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default App;
