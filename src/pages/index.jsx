import Layout from "./Layout.jsx";

import AdoptPet from "./AdoptPet";

import BrazilStatesGame from "./BrazilStatesGame";

import ClassroomChoice from "./ClassroomChoice";

import ClassroomParent from "./ClassroomParent";

import ColorsGame from "./ColorsGame";

import Dictionary from "./Dictionary";

import DidYouKnow from "./DidYouKnow";

import Donation from "./Donation";

import DressBoyGame from "./DressBoyGame";

import DressUpGame from "./DressUpGame";

import EnglishClass from "./EnglishClass";

import EnglishWordsGame from "./EnglishWordsGame";

import EvolvingWorld from "./EvolvingWorld";

import Home from "./Home";

import KidsArea from "./KidsArea";

import LettersGame from "./LettersGame";

import MemoryGame from "./MemoryGame";

import NumbersGame from "./NumbersGame";

import ParentDashboard from "./ParentDashboard";

import ParentLogin from "./ParentLogin";

import ParentMessages from "./ParentMessages";

import ParentRoutines from "./ParentRoutines";

import ParentTips from "./ParentTips";

import PetCare from "./PetCare";

import PuzzleGame from "./PuzzleGame";

import RacingGame from "./RacingGame";

import RightWrongGame from "./RightWrongGame";

import SevenDifferencesGame from "./SevenDifferencesGame";

import ShapesGame from "./ShapesGame";

import SnakeGame from "./SnakeGame";

import StudentJoin from "./StudentJoin";

import TeacherDashboard from "./TeacherDashboard";

import TeacherLogin from "./TeacherLogin";

import TrafficEducationGame from "./TrafficEducationGame";

import VirtualClassroom from "./VirtualClassroom";

import VirtualLibrary from "./VirtualLibrary";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    AdoptPet: AdoptPet,
    
    BrazilStatesGame: BrazilStatesGame,
    
    ClassroomChoice: ClassroomChoice,
    
    ClassroomParent: ClassroomParent,
    
    ColorsGame: ColorsGame,
    
    Dictionary: Dictionary,
    
    DidYouKnow: DidYouKnow,
    
    Donation: Donation,
    
    DressBoyGame: DressBoyGame,
    
    DressUpGame: DressUpGame,
    
    EnglishClass: EnglishClass,
    
    EnglishWordsGame: EnglishWordsGame,
    
    EvolvingWorld: EvolvingWorld,
    
    Home: Home,
    
    KidsArea: KidsArea,
    
    LettersGame: LettersGame,
    
    MemoryGame: MemoryGame,
    
    NumbersGame: NumbersGame,
    
    ParentDashboard: ParentDashboard,
    
    ParentLogin: ParentLogin,
    
    ParentMessages: ParentMessages,
    
    ParentRoutines: ParentRoutines,
    
    ParentTips: ParentTips,
    
    PetCare: PetCare,
    
    PuzzleGame: PuzzleGame,
    
    RacingGame: RacingGame,
    
    RightWrongGame: RightWrongGame,
    
    SevenDifferencesGame: SevenDifferencesGame,
    
    ShapesGame: ShapesGame,
    
    SnakeGame: SnakeGame,
    
    StudentJoin: StudentJoin,
    
    TeacherDashboard: TeacherDashboard,
    
    TeacherLogin: TeacherLogin,
    
    TrafficEducationGame: TrafficEducationGame,
    
    VirtualClassroom: VirtualClassroom,
    
    VirtualLibrary: VirtualLibrary,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<AdoptPet />} />
                
                
                <Route path="/AdoptPet" element={<AdoptPet />} />
                
                <Route path="/BrazilStatesGame" element={<BrazilStatesGame />} />
                
                <Route path="/ClassroomChoice" element={<ClassroomChoice />} />
                
                <Route path="/ClassroomParent" element={<ClassroomParent />} />
                
                <Route path="/ColorsGame" element={<ColorsGame />} />
                
                <Route path="/Dictionary" element={<Dictionary />} />
                
                <Route path="/DidYouKnow" element={<DidYouKnow />} />
                
                <Route path="/Donation" element={<Donation />} />
                
                <Route path="/DressBoyGame" element={<DressBoyGame />} />
                
                <Route path="/DressUpGame" element={<DressUpGame />} />
                
                <Route path="/EnglishClass" element={<EnglishClass />} />
                
                <Route path="/EnglishWordsGame" element={<EnglishWordsGame />} />
                
                <Route path="/EvolvingWorld" element={<EvolvingWorld />} />
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/KidsArea" element={<KidsArea />} />
                
                <Route path="/LettersGame" element={<LettersGame />} />
                
                <Route path="/MemoryGame" element={<MemoryGame />} />
                
                <Route path="/NumbersGame" element={<NumbersGame />} />
                
                <Route path="/ParentDashboard" element={<ParentDashboard />} />
                
                <Route path="/ParentLogin" element={<ParentLogin />} />
                
                <Route path="/ParentMessages" element={<ParentMessages />} />
                
                <Route path="/ParentRoutines" element={<ParentRoutines />} />
                
                <Route path="/ParentTips" element={<ParentTips />} />
                
                <Route path="/PetCare" element={<PetCare />} />
                
                <Route path="/PuzzleGame" element={<PuzzleGame />} />
                
                <Route path="/RacingGame" element={<RacingGame />} />
                
                <Route path="/RightWrongGame" element={<RightWrongGame />} />
                
                <Route path="/SevenDifferencesGame" element={<SevenDifferencesGame />} />
                
                <Route path="/ShapesGame" element={<ShapesGame />} />
                
                <Route path="/SnakeGame" element={<SnakeGame />} />
                
                <Route path="/StudentJoin" element={<StudentJoin />} />
                
                <Route path="/TeacherDashboard" element={<TeacherDashboard />} />
                
                <Route path="/TeacherLogin" element={<TeacherLogin />} />
                
                <Route path="/TrafficEducationGame" element={<TrafficEducationGame />} />
                
                <Route path="/VirtualClassroom" element={<VirtualClassroom />} />
                
                <Route path="/VirtualLibrary" element={<VirtualLibrary />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}