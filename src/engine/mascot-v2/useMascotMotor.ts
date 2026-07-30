import { useState, useEffect, useCallback, useRef } from 'react';

type MascotState = 'idle' | 'walking' | 'sleeping' | 'eating' | 'playing' | 'angry' | 'tired' | 'victory' | 'sitting' | 'jumping' | 'hurt' | 'blinking' | 'looking' | 'sneezing';

interface MascotMotorConfig {
  initialEnergy?: number;
  initialHunger?: number;
  initialHappiness?: number;
  disableAutonomous?: boolean;
}

export function useMascotMotor(config?: MascotMotorConfig) {
  const [currentState, setCurrentState] = useState<MascotState>('idle');
  
  // Posição no mundo (em px: -200 a 200 do centro)
  const [positionX, setPositionX] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  // Status attributes (0 to 100)
  const [energy, setEnergy] = useState(config?.initialEnergy ?? 100);
  const [hunger, setHunger] = useState(config?.initialHunger ?? 100);
  const [happiness, setHappiness] = useState(config?.initialHappiness ?? 100);
  
  const lastInteraction = useRef(Date.now());
  const brainInterval = useRef<NodeJS.Timeout | null>(null);

  // Derivar a pose visual da sprite (mapeamento)
  const getPoseForState = (): string => {
    switch (currentState) {
      case 'idle': return 'idle_front';
      case 'walking': return direction === 'left' ? 'walk_left' : 'walk_right';
      case 'sleeping': return 'sleep';
      case 'eating': return 'eat';
      case 'playing': return 'victory_jump';
      case 'angry': return 'roar_special';
      case 'tired': return 'hurt_dizzy';
      case 'hurt': return 'hurt_dizzy';
      case 'victory': return 'flex_power';
      case 'sitting': return 'sit_idle';
      case 'jumping': return 'jump';
      case 'blinking': return 'idle_wake';
      case 'looking': return 'idle_lie';
      case 'sneezing': return 'hurt_dizzy';
      default: return 'idle_front';
    }
  };

  const currentPose = getPoseForState();

  const resetInteraction = () => {
    lastInteraction.current = Date.now();
  };

  // Ações do usuário
  const feed = useCallback(() => {
    resetInteraction();
    setCurrentState('eating');
    setHunger(prev => Math.min(100, prev + 30));
    setEnergy(prev => Math.min(100, prev + 5));
    setTimeout(() => setCurrentState('idle'), 3000);
  }, []);

  const sleep = useCallback(() => {
    resetInteraction();
    setCurrentState('sleeping');
    setEnergy(100);
    setTimeout(() => setCurrentState('idle'), 5000);
  }, []);

  const play = useCallback(() => {
    resetInteraction();
    if (energy < 20) {
      setCurrentState('tired');
      setTimeout(() => setCurrentState('idle'), 3000);
      return;
    }
    setCurrentState('playing');
    setHappiness(prev => Math.min(100, prev + 20));
    setEnergy(prev => Math.max(0, prev - 20));
    setHunger(prev => Math.max(0, prev - 10));
    setTimeout(() => setCurrentState('idle'), 3000);
  }, [energy]);

  const poke = useCallback(() => {
    resetInteraction();
    setCurrentState('angry');
    setHappiness(prev => Math.max(0, prev - 10));
    setTimeout(() => setCurrentState('idle'), 2000);
  }, []);

  const walk = useCallback(() => {
    setCurrentState('walking');
    // Determinar nova direção (alternar ou seguir o limite)
    const newDirection = positionX > 0 ? 'left' : 'right';
    setDirection(newDirection);
    
    // Mover
    const step = 18; 
    setPositionX(prev => newDirection === 'left' ? Math.max(-35, prev - step) : Math.min(35, prev + step));
    
    setEnergy(prev => Math.max(0, prev - 5));
    
    // Parar de andar depois do tempo da animação (por exemplo 1200ms)
    setTimeout(() => setCurrentState('idle'), 1200);
  }, [positionX]);

  // Motor passivo (diminui atributos com o tempo)
  useEffect(() => {
    const passiveMotor = setInterval(() => {
      setHunger(prev => Math.max(0, prev - 1));
      setEnergy(prev => Math.max(0, prev - 1));
      setHappiness(prev => Math.max(0, prev - 1));
    }, 10000);

    return () => clearInterval(passiveMotor);
  }, []);

  // Inteligência Autônoma (Widget behavior)
  useEffect(() => {
    if (currentState !== 'idle' || config?.disableAutonomous) return;

    const autonomousMotor = setTimeout(() => {
      const timeSinceLastInteraction = Date.now() - lastInteraction.current;

      // Necessidades vitais (se estiver muito baixo, força comportamento)
      if (hunger < 30 && Math.random() < 0.4) {
        setCurrentState('eating');
        setTimeout(() => setCurrentState('idle'), 3000);
        return;
      }
      
      if (energy < 20 && Math.random() < 0.4) {
        setCurrentState('sleeping');
        setTimeout(() => setCurrentState('idle'), 5000);
        return;
      }
      
      // Micro-ações frequentes para dar vida (a cada 3-5s)
      const randomChance = Math.random();
      
      if (randomChance < 0.25) {
        // 25% chance de Andar de um lado para o outro
        const dir = Math.random() > 0.5 ? 'left' : 'right';
        setDirection(dir);
        setCurrentState('walking');
        setPositionX(prev => dir === 'left' ? Math.max(-35, prev - 15) : Math.min(35, prev + 15));
        setTimeout(() => setCurrentState('idle'), 1200);
      } else if (randomChance < 0.40) {
        // 15% chance de Deitar (Lying down)
        setCurrentState('looking'); // maps to 'idle_lie'
        setTimeout(() => setCurrentState('idle'), 3000);
      } else if (randomChance < 0.55) {
        // 15% chance de Piscar / Acordar
        setCurrentState('blinking');
        setTimeout(() => setCurrentState('idle'), 1500);
      } else if (randomChance < 0.65) {
        // 10% chance de Sentar
        setCurrentState('sitting');
        setTimeout(() => setCurrentState('idle'), 2500);
      } else if (randomChance < 0.70) {
        // 5% chance de Espirrar / Tonto
        setCurrentState('sneezing');
        setTimeout(() => setCurrentState('idle'), 1500);
      }

      // 30% chance de não fazer nada e só continuar idle
    }, 3000 + Math.random() * 2500); // Trigger every 3 to 5.5 seconds

    return () => clearTimeout(autonomousMotor);
  }, [currentState, energy, hunger, config?.disableAutonomous]);

  return {
    currentState,
    currentPose,
    positionX,
    direction,
    energy,
    hunger,
    happiness,
    actions: { feed, sleep, play, poke, walk, resetInteraction }
  };
}
