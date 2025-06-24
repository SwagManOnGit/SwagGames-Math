// SwagGames Game Logic and Math Problem Generation System

export class MathProblemGenerator {
  constructor() {
    this.problemTemplates = {
      // Middle School Level
      arithmetic: [
        {
          template: "What is {a} + {b}?",
          generate: () => {
            const a = Math.floor(Math.random() * 100) + 1;
            const b = Math.floor(Math.random() * 100) + 1;
            return {
              question: `What is ${a} + ${b}?`,
              answer: (a + b).toString(),
              variables: { a, b }
            };
          },
          difficulty: 1
        },
        {
          template: "What is {a} × {b}?",
          generate: () => {
            const a = Math.floor(Math.random() * 12) + 1;
            const b = Math.floor(Math.random() * 12) + 1;
            return {
              question: `What is ${a} × ${b}?`,
              answer: (a * b).toString(),
              variables: { a, b }
            };
          },
          difficulty: 1
        },
        {
          template: "Simplify the fraction {numerator}/{denominator}",
          generate: () => {
            const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
            let numerator = Math.floor(Math.random() * 20) + 2;
            let denominator = Math.floor(Math.random() * 20) + 2;
            const commonFactor = Math.floor(Math.random() * 5) + 2;
            numerator *= commonFactor;
            denominator *= commonFactor;
            const simplifiedNum = numerator / gcd(numerator, denominator);
            const simplifiedDen = denominator / gcd(numerator, denominator);
            return {
              question: `Simplify the fraction ${numerator}/${denominator}`,
              answer: simplifiedDen === 1 ? simplifiedNum.toString() : `${simplifiedNum}/${simplifiedDen}`,
              variables: { numerator, denominator }
            };
          },
          difficulty: 2
        }
      ],
      
      // High School Algebra
      algebra: [
        {
          template: "Solve for x: {a}x + {b} = {c}",
          generate: () => {
            const a = Math.floor(Math.random() * 10) + 1;
            const x = Math.floor(Math.random() * 20) - 10;
            const b = Math.floor(Math.random() * 20) - 10;
            const c = a * x + b;
            return {
              question: `Solve for x: ${a}x ${b >= 0 ? '+' : ''} ${b} = ${c}`,
              answer: x.toString(),
              variables: { a, b, c, x }
            };
          },
          difficulty: 3
        },
        {
          template: "Expand: (x + {a})(x + {b})",
          generate: () => {
            const a = Math.floor(Math.random() * 10) - 5;
            const b = Math.floor(Math.random() * 10) - 5;
            const constant = a * b;
            const linear = a + b;
            let answer = "x²";
            if (linear !== 0) {
              answer += linear > 0 ? ` + ${linear}x` : ` - ${Math.abs(linear)}x`;
            }
            if (constant !== 0) {
              answer += constant > 0 ? ` + ${constant}` : ` - ${Math.abs(constant)}`;
            }
            return {
              question: `Expand: (x ${a >= 0 ? '+' : ''} ${a})(x ${b >= 0 ? '+' : ''} ${b})`,
              answer: answer,
              variables: { a, b }
            };
          },
          difficulty: 4
        },
        {
          template: "Solve the quadratic: x² + {b}x + {c} = 0",
          generate: () => {
            // Generate two roots
            const root1 = Math.floor(Math.random() * 10) - 5;
            const root2 = Math.floor(Math.random() * 10) - 5;
            const b = -(root1 + root2);
            const c = root1 * root2;
            const answer = root1 === root2 ? `x = ${root1}` : `x = ${Math.min(root1, root2)}, ${Math.max(root1, root2)}`;
            return {
              question: `Solve the quadratic: x² ${b >= 0 ? '+' : ''} ${b}x ${c >= 0 ? '+' : ''} ${c} = 0`,
              answer: answer,
              variables: { b, c, root1, root2 }
            };
          },
          difficulty: 5
        }
      ],
      
      // Geometry
      geometry: [
        {
          template: "Find the area of a rectangle with length {l} and width {w}",
          generate: () => {
            const l = Math.floor(Math.random() * 20) + 1;
            const w = Math.floor(Math.random() * 20) + 1;
            return {
              question: `Find the area of a rectangle with length ${l} and width ${w}`,
              answer: (l * w).toString(),
              variables: { l, w }
            };
          },
          difficulty: 2
        },
        {
          template: "Find the area of a circle with radius {r}",
          generate: () => {
            const r = Math.floor(Math.random() * 10) + 1;
            const area = Math.PI * r * r;
            return {
              question: `Find the area of a circle with radius ${r} (use π ≈ 3.14159)`,
              answer: area.toFixed(2),
              variables: { r }
            };
          },
          difficulty: 3
        },
        {
          template: "In a right triangle, if one leg is {a} and the hypotenuse is {c}, find the other leg",
          generate: () => {
            const a = Math.floor(Math.random() * 10) + 3;
            const c = a + Math.floor(Math.random() * 10) + 1;
            const b = Math.sqrt(c * c - a * a);
            return {
              question: `In a right triangle, if one leg is ${a} and the hypotenuse is ${c}, find the other leg`,
              answer: b.toFixed(2),
              variables: { a, c }
            };
          },
          difficulty: 4
        }
      ],
      
      // Calculus
      calculus: [
        {
          template: "Find the derivative of x^{n}",
          generate: () => {
            const n = Math.floor(Math.random() * 8) + 2;
            const answer = n === 2 ? "2x" : `${n}x^${n-1}`;
            return {
              question: `Find the derivative of x^${n}`,
              answer: answer,
              variables: { n }
            };
          },
          difficulty: 6
        },
        {
          template: "Evaluate the integral of {a}x^{n} dx",
          generate: () => {
            const a = Math.floor(Math.random() * 10) + 1;
            const n = Math.floor(Math.random() * 5) + 1;
            const newPower = n + 1;
            const coefficient = a / newPower;
            const answer = coefficient === 1 ? `x^${newPower} + C` : `${coefficient}x^${newPower} + C`;
            return {
              question: `Evaluate the integral of ${a}x^${n} dx`,
              answer: answer,
              variables: { a, n }
            };
          },
          difficulty: 7
        }
      ]
    };
  }

  generateProblem(category, difficulty = null) {
    const categoryProblems = this.problemTemplates[category];
    if (!categoryProblems) return null;
    
    let availableProblems = categoryProblems;
    if (difficulty) {
      availableProblems = categoryProblems.filter(p => p.difficulty === difficulty);
    }
    
    if (availableProblems.length === 0) return null;
    
    const randomProblem = availableProblems[Math.floor(Math.random() * availableProblems.length)];
    const generated = randomProblem.generate();
    
    return {
      ...generated,
      category: category,
      difficulty: randomProblem.difficulty,
      type: this.getCategoryDisplayName(category),
      hint: this.generateHint(category, generated)
    };
  }

  getCategoryDisplayName(category) {
    const displayNames = {
      arithmetic: "Arithmetic",
      algebra: "Algebra",
      geometry: "Geometry",
      calculus: "Calculus"
    };
    return displayNames[category] || category;
  }

  generateHint(category, problem) {
    const hints = {
      arithmetic: "Break down the problem step by step.",
      algebra: "Isolate the variable by performing the same operation on both sides.",
      geometry: "Remember the relevant formulas for area, perimeter, and the Pythagorean theorem.",
      calculus: "Apply the power rule or fundamental theorem of calculus."
    };
    return hints[category] || "Think step by step and use the appropriate mathematical principles.";
  }
}

export class RoguelikeGameEngine {
  constructor() {
    this.mathGenerator = new MathProblemGenerator();
    this.gameState = {
      dungeonLevel: 1,
      playerHealth: 100,
      maxHealth: 100,
      currentRoom: 0,
      roomsCleared: 0,
      itemsCollected: [],
      activeEffects: [],
      difficulty: 'apprentice'
    };
    
    this.difficultyMappings = {
      'novice': { categories: ['arithmetic'], difficultyRange: [1, 2] },
      'apprentice': { categories: ['arithmetic', 'algebra'], difficultyRange: [2, 4] },
      'scholar': { categories: ['algebra', 'geometry'], difficultyRange: [3, 5] },
      'expert': { categories: ['algebra', 'geometry', 'calculus'], difficultyRange: [4, 6] },
      'master': { categories: ['geometry', 'calculus'], difficultyRange: [5, 7] }
    };
  }

  generateDungeonRoom() {
    const roomTypes = ['problem', 'treasure', 'shop', 'rest', 'trap'];
    const weights = [0.6, 0.15, 0.1, 0.1, 0.05]; // Problem rooms are most common
    
    const randomValue = Math.random();
    let cumulativeWeight = 0;
    
    for (let i = 0; i < roomTypes.length; i++) {
      cumulativeWeight += weights[i];
      if (randomValue <= cumulativeWeight) {
        return this.createRoom(roomTypes[i]);
      }
    }
    
    return this.createRoom('problem'); // Fallback
  }

  createRoom(type) {
    const baseRoom = {
      type: type,
      level: this.gameState.dungeonLevel,
      cleared: false
    };

    switch (type) {
      case 'problem':
        return {
          ...baseRoom,
          problem: this.generateProblemForCurrentDifficulty(),
          reward: this.generateReward(),
          timeLimit: this.calculateTimeLimit()
        };
      
      case 'treasure':
        return {
          ...baseRoom,
          treasure: this.generateTreasure(),
          description: "You found a treasure chest!"
        };
      
      case 'shop':
        return {
          ...baseRoom,
          items: this.generateShopItems(),
          description: "A mysterious merchant offers you tools..."
        };
      
      case 'rest':
        return {
          ...baseRoom,
          healAmount: Math.floor(Math.random() * 30) + 20,
          description: "A peaceful study area where you can rest and recover."
        };
      
      case 'trap':
        return {
          ...baseRoom,
          problem: this.generateProblemForCurrentDifficulty(),
          penalty: Math.floor(Math.random() * 20) + 10,
          description: "A tricky problem appears suddenly!"
        };
      
      default:
        return baseRoom;
    }
  }

  generateProblemForCurrentDifficulty() {
    const difficultyConfig = this.difficultyMappings[this.gameState.difficulty];
    const categories = difficultyConfig.categories;
    const [minDiff, maxDiff] = difficultyConfig.difficultyRange;
    
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomDifficulty = Math.floor(Math.random() * (maxDiff - minDiff + 1)) + minDiff;
    
    return this.mathGenerator.generateProblem(randomCategory, randomDifficulty);
  }

  generateReward() {
    const rewards = [
      { type: 'xp', amount: Math.floor(Math.random() * 50) + 25 },
      { type: 'coins', amount: Math.floor(Math.random() * 20) + 10 },
      { type: 'health', amount: Math.floor(Math.random() * 25) + 15 },
      { type: 'item', item: this.generateRandomItem() }
    ];
    
    return rewards[Math.floor(Math.random() * rewards.length)];
  }

  generateTreasure() {
    const treasures = [
      { type: 'rare_item', item: this.generateRareItem() },
      { type: 'large_coins', amount: Math.floor(Math.random() * 100) + 50 },
      { type: 'formula_card', formula: this.generateFormulaCard() }
    ];
    
    return treasures[Math.floor(Math.random() * treasures.length)];
  }

  generateRandomItem() {
    const items = [
      { name: 'Basic Calculator', rarity: 'common', uses: Infinity },
      { name: 'Scientific Calculator', rarity: 'uncommon', uses: Infinity },
      { name: 'Hint Scroll', rarity: 'common', uses: 3 },
      { name: 'Time Extension', rarity: 'uncommon', uses: 1 },
      { name: 'Health Potion', rarity: 'common', uses: 1 }
    ];
    
    return items[Math.floor(Math.random() * items.length)];
  }

  generateRareItem() {
    const rareItems = [
      { name: 'Graphing Calculator', rarity: 'rare', uses: Infinity },
      { name: 'Theorem Scroll', rarity: 'rare', uses: 1 },
      { name: 'Perfect Solution Crystal', rarity: 'legendary', uses: 1 }
    ];
    
    return rareItems[Math.floor(Math.random() * rareItems.length)];
  }

  generateFormulaCard() {
    const formulas = [
      'Pythagorean Theorem',
      'Quadratic Formula',
      'Distance Formula',
      'Area of Circle',
      'Derivative Power Rule',
      'Integration by Parts'
    ];
    
    return formulas[Math.floor(Math.random() * formulas.length)];
  }

  generateShopItems() {
    const shopItems = [];
    const numItems = Math.floor(Math.random() * 4) + 2;
    
    for (let i = 0; i < numItems; i++) {
      const item = this.generateRandomItem();
      item.price = this.calculateItemPrice(item);
      shopItems.push(item);
    }
    
    return shopItems;
  }

  calculateItemPrice(item) {
    const basePrices = {
      'common': 20,
      'uncommon': 50,
      'rare': 100,
      'legendary': 200
    };
    
    return basePrices[item.rarity] + Math.floor(Math.random() * 20);
  }

  calculateTimeLimit() {
    const baseTime = 60; // 60 seconds base
    const difficultyModifier = {
      'novice': 1.5,
      'apprentice': 1.2,
      'scholar': 1.0,
      'expert': 0.8,
      'master': 0.6
    };
    
    return Math.floor(baseTime * difficultyModifier[this.gameState.difficulty]);
  }

  processAnswer(answer, correctAnswer, timeUsed, timeLimit) {
    const isCorrect = this.checkAnswer(answer, correctAnswer);
    const timeBonus = this.calculateTimeBonus(timeUsed, timeLimit);
    
    let result = {
      correct: isCorrect,
      timeBonus: timeBonus,
      xpGained: 0,
      coinsGained: 0,
      healthChange: 0,
      streakBroken: false
    };

    if (isCorrect) {
      result.xpGained = 50 + timeBonus;
      result.coinsGained = 10 + Math.floor(timeBonus / 5);
      this.gameState.roomsCleared++;
    } else {
      result.healthChange = -15;
      result.streakBroken = true;
      this.gameState.playerHealth = Math.max(0, this.gameState.playerHealth - 15);
    }

    return result;
  }

  checkAnswer(userAnswer, correctAnswer) {
    // Normalize answers for comparison
    const normalize = (str) => str.toString().toLowerCase().replace(/\s+/g, '');
    return normalize(userAnswer) === normalize(correctAnswer);
  }

  calculateTimeBonus(timeUsed, timeLimit) {
    const timeRatio = timeUsed / timeLimit;
    if (timeRatio <= 0.3) return 25; // Very fast
    if (timeRatio <= 0.5) return 15; // Fast
    if (timeRatio <= 0.7) return 10; // Normal
    if (timeRatio <= 0.9) return 5;  // Slow
    return 0; // Very slow
  }

  isGameOver() {
    return this.gameState.playerHealth <= 0;
  }

  shouldLevelUp() {
    return this.gameState.roomsCleared >= 10; // Level up every 10 rooms
  }

  levelUp() {
    this.gameState.dungeonLevel++;
    this.gameState.roomsCleared = 0;
    this.gameState.playerHealth = Math.min(this.gameState.maxHealth, this.gameState.playerHealth + 25);
    
    // Increase difficulty every few levels
    if (this.gameState.dungeonLevel % 3 === 0) {
      this.increaseDifficulty();
    }
  }

  increaseDifficulty() {
    const difficulties = ['novice', 'apprentice', 'scholar', 'expert', 'master'];
    const currentIndex = difficulties.indexOf(this.gameState.difficulty);
    if (currentIndex < difficulties.length - 1) {
      this.gameState.difficulty = difficulties[currentIndex + 1];
    }
  }

  getGameState() {
    return { ...this.gameState };
  }

  resetGame() {
    this.gameState = {
      dungeonLevel: 1,
      playerHealth: 100,
      maxHealth: 100,
      currentRoom: 0,
      roomsCleared: 0,
      itemsCollected: [],
      activeEffects: [],
      difficulty: 'apprentice'
    };
  }
}

export class ProgressionSystem {
  constructor() {
    this.ranks = [
      { name: 'Middle School Novice', xpRequired: 0, maxXP: 1000 },
      { name: 'Algebra Apprentice', xpRequired: 1000, maxXP: 3000 },
      { name: 'Geometry Scholar', xpRequired: 3000, maxXP: 6000 },
      { name: 'Algebra II Ace', xpRequired: 6000, maxXP: 10000 },
      { name: 'Pre-Calculus Pro', xpRequired: 10000, maxXP: 15000 },
      { name: 'Calculus Conqueror', xpRequired: 15000, maxXP: 20000 },
      { name: 'Linear Logic Master', xpRequired: 20000, maxXP: 30000 },
      { name: 'Analysis Architect', xpRequired: 30000, maxXP: 45000 },
      { name: 'Abstract Alchemist', xpRequired: 45000, maxXP: 60000 },
      { name: 'Theoretical Titan', xpRequired: 60000, maxXP: Infinity }
    ];
  }

  getCurrentRank(xp) {
    for (let i = this.ranks.length - 1; i >= 0; i--) {
      if (xp >= this.ranks[i].xpRequired) {
        return {
          ...this.ranks[i],
          index: i,
          progress: this.calculateProgress(xp, i)
        };
      }
    }
    return this.ranks[0];
  }

  calculateProgress(xp, rankIndex) {
    const currentRank = this.ranks[rankIndex];
    const nextRank = this.ranks[rankIndex + 1];
    
    if (!nextRank) return 100; // Max rank
    
    const progressXP = xp - currentRank.xpRequired;
    const totalXPNeeded = nextRank.xpRequired - currentRank.xpRequired;
    
    return Math.min(100, (progressXP / totalXPNeeded) * 100);
  }

  getNextRankRequirement(xp) {
    const currentRank = this.getCurrentRank(xp);
    const nextRank = this.ranks[currentRank.index + 1];
    
    if (!nextRank) return null;
    
    return {
      nextRank: nextRank.name,
      xpNeeded: nextRank.xpRequired - xp
    };
  }
}

// Export default game engine instance
export const gameEngine = new RoguelikeGameEngine();
export const progressionSystem = new ProgressionSystem();
export const mathGenerator = new MathProblemGenerator();

