import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Textarea } from './components/ui/textarea'
import { Badge } from './components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { Progress } from './components/ui/progress'
import {
  Calculator,
  Brain,
  Sparkles,
  Timer,
  Heart,
  Coins,
  Zap,
  Trophy,
  Users,
  Settings,
  Sword,
  Shield,
  Clock,
  ShoppingCart,
  StickyNote,
  X,
  Maximize2,
  Minimize2
} from 'lucide-react'
import { gameEngine, progressionSystem } from './gameLogic'
import './App.css'

function App() {
  // Existing state
  const [currentView, setCurrentView] = useState('dashboard')
  const [currentAnswer, setCurrentAnswer] = useState("")
  const [showHint, setShowHint] = useState(false)

  // Enhanced state for new features
  const [selectedEquipment, setSelectedEquipment] = useState({
    health: null,
    time: null,
    coins: null
  })
  const [inventory, setInventory] = useState({
    calculatorUses: 0,
    formulaUses: 0,
    hintUses: 0
  })

  const [gameState, setGameState] = useState({
    inGame: false,
    currentRoom: null,
    currentProblem: null,
    dungeonLevel: 1,
    timeLeft: 0,
    maxTime: 0,
    tools: ['Basic Calculator', 'Pythagorean Formula']
  })

  const [playerData, setPlayerData] = useState({
    rank: "Algebra Apprentice",
    xp: 1300,
    maxXP: 3000,
    nextRankXP: 3000,
    health: 85,
    maxHealth: 100,
    coins: 257,
    streak: 13,
    totalProblems: 157,
    accuracy: 87,
    equipment: {
      health: null,
      time: null,
      coins: null
    }
  })

  // Ref for the input field
  const inputRef = useRef(null)

  // Equipment definitions
  const equipmentTypes = {
    health: [
      { id: 'health1', name: 'Iron Heart', bonus: 10, rarity: 'common', description: '+10 Max Health' },
      { id: 'health2', name: 'Steel Heart', bonus: 20, rarity: 'uncommon', description: '+20 Max Health' },
      { id: 'health3', name: 'Diamond Heart', bonus: 30, rarity: 'rare', description: '+30 Max Health' }
    ],
    time: [
      { id: 'time1', name: 'Quick Thinking', bonus: 10, rarity: 'common', description: '+10 Seconds' },
      { id: 'time2', name: 'Time Dilation', bonus: 20, rarity: 'uncommon', description: '+20 Seconds' },
      { id: 'time3', name: 'Temporal Mastery', bonus: 30, rarity: 'rare', description: '+30 Seconds' }
    ],
    coins: [
      { id: 'coins1', name: 'Lucky Penny', bonus: 25, rarity: 'common', description: '+25% Coins' },
      { id: 'coins2', name: 'Golden Touch', bonus: 50, rarity: 'uncommon', description: '+50% Coins' },
      { id: 'coins3', name: 'Midas Blessing', bonus: 100, rarity: 'rare', description: '+100% Coins' }
    ]
  }

  // Shop items
  const shopItems = [
    { id: 'calc_uses', name: 'Calculator Uses', price: 50, quantity: 5, description: '5 uses of advanced calculator' },
    { id: 'formula_uses', name: 'Formula Cards', price: 75, quantity: 3, description: '3 uses of formula reference' },
    { id: 'hint_uses', name: 'Hint Tokens', price: 100, quantity: 2, description: '2 free hints without XP penalty' }
  ]

  // Timer effect
  useEffect(() => {
    let interval
    if (gameState.inGame && gameState.timeLeft > 0) {
      interval = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }))
      }, 1000)
    } else if (gameState.timeLeft === 0 && gameState.inGame) {
      handleTimeUp()
    }
    return () => clearInterval(interval)
  }, [gameState.timeLeft, gameState.inGame])

  // Focus input field when problem changes
  useEffect(() => {
    if (inputRef.current && gameState.inGame && gameState.currentProblem) {
      inputRef.current.focus()
    }
  }, [gameState.currentProblem])

  // Apply equipment bonuses
  const getEffectiveMaxHealth = () => {
    const baseHealth = 100
    const healthBonus = selectedEquipment.health ? equipmentTypes.health.find(e => e.id === selectedEquipment.health)?.bonus || 0 : 0
    return baseHealth + healthBonus
  }

  const getEffectiveTimeLimit = (baseTime) => {
    const timeBonus = selectedEquipment.time ? equipmentTypes.time.find(e => e.id === selectedEquipment.time)?.bonus || 0 : 0
    return baseTime + timeBonus
  }

  const getEffectiveCoins = (baseCoins) => {
    const coinBonus = selectedEquipment.coins ? equipmentTypes.coins.find(e => e.id === selectedEquipment.coins)?.bonus || 0 : 0
    return Math.floor(baseCoins * (1 + coinBonus / 100))
  }

  const startDungeon = (dungeonType) => {
    gameEngine.resetGame()
    const problem = gameEngine.generateProblemForCurrentDifficulty()
    const baseTimeLimit = gameEngine.calculateTimeLimit()
    const timeLimit = getEffectiveTimeLimit(baseTimeLimit)

    const room = {
      type: 'problem',
      level: 1,
      cleared: false,
      problem: problem,
      reward: gameEngine.generateReward(),
      timeLimit: timeLimit
    }

    setGameState({
      ...gameState,
      inGame: true,
      currentRoom: room,
      currentProblem: problem,
      dungeonLevel: 1,
      timeLeft: timeLimit,
      maxTime: timeLimit
    })
    setCurrentView('game')
    setCurrentAnswer("")
    setShowHint(false)
  }

  const submitAnswer = () => {
    if (!gameState.currentProblem || !currentAnswer.trim()) return

    const timeUsed = gameState.maxTime - gameState.timeLeft
    const result = gameEngine.processAnswer(
      currentAnswer.trim(),
      gameState.currentProblem.answer,
      timeUsed,
      gameState.maxTime
    )

    // Apply equipment bonuses to rewards
    const effectiveCoins = getEffectiveCoins(result.coinsGained)

    // Update player data based on result
    setPlayerData(prev => {
      const newXP = prev.xp + result.xpGained
      const newCoins = prev.coins + effectiveCoins
      const maxHealth = getEffectiveMaxHealth()
      const newHealth = Math.max(0, Math.min(maxHealth, prev.health + result.healthChange))
      const newStreak = result.streakBroken ? 0 : prev.streak + (result.correct ? 1 : 0)
      const newTotal = prev.totalProblems + 1
      const newAccuracy = Math.round(((prev.accuracy * prev.totalProblems) + (result.correct ? 100 : 0)) / newTotal)

      const currentRank = progressionSystem.getCurrentRank(newXP)
      const nextRankInfo = progressionSystem.getNextRankRequirement(newXP)

      return {
        ...prev,
        xp: newXP,
        coins: newCoins,
        health: newHealth,
        maxHealth: maxHealth,
        streak: newStreak,
        totalProblems: newTotal,
        accuracy: newAccuracy,
        rank: currentRank.name,
        maxXP: currentRank.xpNeeded,
        nextRankXP: nextRankInfo ? nextRankInfo.xpNeeded + newXP : newXP
      }
    })

    // Award equipment on dungeon completion
    if (result.correct && Math.random() < 0.3) { // 30% chance for equipment drop
      awardRandomEquipment()
    }

    if (gameEngine.isGameOver()) {
      endGame()
      return
    }

    if (gameEngine.shouldLevelUp()) {
      gameEngine.levelUp()
      setGameState(prev => ({
        ...prev,
        dungeonLevel: gameEngine.getGameState().dungeonLevel
      }))
    }

    setTimeout(() => {
      generateNewProblem()
    }, 1500)
  }

  const awardRandomEquipment = () => {
    const types = ['health', 'time', 'coins']
    const randomType = types[Math.floor(Math.random() * types.length)]
    const equipment = equipmentTypes[randomType]
    const randomEquipment = equipment[Math.floor(Math.random() * equipment.length)]

    // Add to player's equipment collection (simplified for demo)
    console.log(`Awarded: ${randomEquipment.name}`)
  }

  const generateNewProblem = () => {
    const problem = gameEngine.generateProblemForCurrentDifficulty()
    const baseTimeLimit = gameEngine.calculateTimeLimit()
    const timeLimit = getEffectiveTimeLimit(baseTimeLimit)

    const room = {
      type: 'problem',
      level: gameState.dungeonLevel,
      cleared: false,
      problem: problem,
      reward: gameEngine.generateReward(),
      timeLimit: timeLimit
    }

    setGameState(prev => ({
      ...prev,
      currentRoom: room,
      currentProblem: problem,
      timeLeft: timeLimit,
      maxTime: timeLimit
    }))
    setCurrentAnswer("")
    setShowHint(false)
  }

  const handleTimeUp = () => {
    const result = gameEngine.processAnswer("", gameState.currentProblem.answer, gameState.maxTime, gameState.maxTime)

    setPlayerData(prev => ({
      ...prev,
      health: Math.max(0, prev.health + result.healthChange),
      streak: 0,
      totalProblems: prev.totalProblems + 1,
      accuracy: Math.round(((prev.accuracy * prev.totalProblems) + 0) / (prev.totalProblems + 1))
    }))

    if (gameEngine.isGameOver()) {
      endGame()
    } else {
      setTimeout(() => {
        generateNewProblem()
      }, 1500)
    }
  }

  const endGame = () => {
    setGameState(prev => ({
      ...prev,
      inGame: false,
      currentRoom: null,
      currentProblem: null
    }))
    setCurrentView('dashboard')
  }

  const useHint = () => {
    if (inventory.hintUses > 0) {
      setInventory(prev => ({ ...prev, hintUses: prev.hintUses - 1 }))
      setShowHint(true)
    } else {
      setPlayerData(prev => ({ ...prev, xp: Math.max(0, prev.xp - 5) }))
      setShowHint(true)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      submitAnswer()
    }
  }

  const useTool = (toolName) => {
    switch (toolName) {
      case 'Basic Calculator':
        if (inventory.calculatorUses > 0) {
          setInventory(prev => ({ ...prev, calculatorUses: prev.calculatorUses - 1 }))
          alert('Basic Calculator activated! (Functionality to be implemented)')
        } else {
          alert('You need to purchase more Calculator Uses from the shop!')
        }
        break
      case 'Pythagorean Formula':
        if (inventory.formulaUses > 0) {
          setInventory(prev => ({ ...prev, formulaUses: prev.formulaUses - 1 }))
          alert('Pythagorean Formula activated! (Functionality to be implemented)')
        } else {
          alert('You need to purchase more Formula Cards from the shop!')
        }
        break
      default:
        alert(`Tool ${toolName} not recognized.`) // Fallback for any unhandled tools
    }
  }

  const purchaseItem = (item) => {
    if (playerData.coins >= item.price) {
      setPlayerData(prev => ({ ...prev, coins: prev.coins - item.price }))

      switch (item.id) {
        case 'calc_uses':
          setInventory(prev => ({ ...prev, calculatorUses: prev.calculatorUses + item.quantity }))
          break
        case 'formula_uses':
          setInventory(prev => ({ ...prev, formulaUses: prev.formulaUses + item.quantity }))
          break
        case 'hint_uses':
          setInventory(prev => ({ ...prev, hintUses: prev.hintUses + item.quantity }))
          break
      }
    }
  }

  const equipItem = (type, equipmentId) => {
    setSelectedEquipment(prev => ({ ...prev, [type]: equipmentId }))

    // Update max health if health equipment changed
    if (type === 'health') {
      const newMaxHealth = getEffectiveMaxHealth()
      setPlayerData(prev => ({
        ...prev,
        maxHealth: newMaxHealth,
        health: Math.min(prev.health, newMaxHealth)
      }))
    }
  }

  // Notepad Component
  const NotepadPanel = ({ notepadOpen, setNotepadOpen, notepadContent, setNotepadContent }) => {
    const [notepadMaximized, setNotepadMaximized] = useState(false)
    return (
      <div className={`fixed right-4 top-20 bg-card border rounded-lg shadow-lg transition-all duration-300 z-50 ${
        notepadMaximized ? 'w-96 h-96' : 'w-80 h-64'
      } ${notepadOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center gap-2">
            <StickyNote className="w-4 h-4" />
            <span className="font-medium">Notepad</span>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setNotepadMaximized(!notepadMaximized)}
            >
              {notepadMaximized ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setNotepadOpen(false)}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
        <Textarea
          value={notepadContent}
          onChange={(e) => setNotepadContent(e.target.value)}
          placeholder="Write your notes here..."
          className="w-full h-full border-0 resize-none rounded-none rounded-b-lg"
        />
      </div>
    )
  }

  // Dashboard View
  const DashboardView = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              SwagGames
            </h1>
            <p className="text-slate-400">Math Roguelike Adventure</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setNotepadOpen(prev => !prev)}
              className="border-cyan-500/50 hover:border-cyan-400"
            >
              <StickyNote className="w-4 h-4 mr-2" />
              Notepad
            </Button>
            <Button variant="outline" className="border-green-500/50 hover:border-green-400">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-cyan-500/30 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-cyan-400" />
                <div>
                  <p className="text-sm text-slate-400">Rank</p>
                  <h3 className="text-xl font-bold text-cyan-400">{playerData.rank}</h3>
                  <Progress value={(playerData.xp / playerData.maxXP) * 100} className="mt-2" />
                  <p className="text-xs text-slate-500 mt-1">{playerData.xp} / {playerData.maxXP} XP</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-red-500/30 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Heart className="w-8 h-8 text-red-400" />
                <div>
                  <p className="text-sm text-slate-400">Health</p>
                  <h3 className="text-xl font-bold text-red-400">{playerData.health}/{playerData.maxHealth}</h3>
                  <Progress value={(playerData.health / playerData.maxHealth) * 100} className="mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-yellow-500/30 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Coins className="w-8 h-8 text-yellow-400" />
                <div>
                  <p className="text-sm text-slate-400">Coins</p>
                  <h3 className="text-xl font-bold text-yellow-400">{playerData.coins}</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-green-500/30 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Zap className="w-8 h-8 text-green-400" />
                <div>
                  <p className="text-sm text-slate-400">Streak</p>
                  <h3 className="text-xl font-bold text-green-400">{playerData.streak}</h3>
                  <p className="text-xs text-slate-500">Problems in a row</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="dungeons" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800/50">
            <TabsTrigger value="dungeons" className="data-[state=active]:bg-blue-600">
              <Sword className="w-4 h-4 mr-2" />
              Dungeons
            </TabsTrigger>
            <TabsTrigger value="equipment" className="data-[state=active]:bg-purple-600">
              <Shield className="w-4 h-4 mr-2" />
              Equipment
            </TabsTrigger>
            <TabsTrigger value="shop" className="data-[state=active]:bg-green-600">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Shop
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-orange-600">
              <Trophy className="w-4 h-4 mr-2" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="data-[state=active]:bg-pink-600">
              <Users className="w-4 h-4 mr-2" />
              Leaderboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dungeons" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: "Algebraic Abyss", difficulty: "Apprentice", color: "blue", description: "Master the fundamentals of algebra" },
                { name: "Geometric Labyrinth", difficulty: "Scholar", color: "green", description: "Navigate through shapes and spaces" },
                { name: "Calculus Catacombs", difficulty: "Expert", color: "purple", description: "Explore the depths of calculus" },
                { name: "Statistics Sanctum", difficulty: "Pro", color: "orange", description: "Uncover the secrets of probability" }
              ].map((dungeon, index) => (
                <Card key={index} className="bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-all duration-300 group">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-cyan-400 group-hover:text-cyan-300">{dungeon.name}</CardTitle>
                        <Badge variant="outline" className={`border-${dungeon.color}-500 text-${dungeon.color}-400 mt-2`}>
                          {dungeon.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-400 mb-4">{dungeon.description}</p>
                    <Button 
                      onClick={() => startDungeon(dungeon.name)}
                      className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Enter Dungeon
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="equipment" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(equipmentTypes).map(([type, items]) => (
                <Card key={type} className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 capitalize">
                      {type === 'health' && <Heart className="w-5 h-5 text-red-400" />}
                      {type === 'time' && <Clock className="w-5 h-5 text-blue-400" />}
                      {type === 'coins' && <Coins className="w-5 h-5 text-yellow-400" />}
                      {type} Equipment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="p-3 border border-slate-600 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{item.name}</h4>
                          <Badge variant={item.rarity === 'common' ? 'secondary' : item.rarity === 'uncommon' ? 'default' : 'destructive'}>
                            {item.rarity}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-400 mb-2">{item.description}</p>
                        <Button
                          size="sm"
                          variant={selectedEquipment[type] === item.id ? "default" : "outline"}
                          onClick={() => equipItem(type, item.id)}
                          className="w-full"
                        >
                          {selectedEquipment[type] === item.id ? "Equipped" : "Equip"}
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="shop" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {shopItems.map((item) => (
                <Card key={item.id} className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-400 mb-4">{item.description}</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-yellow-400">{item.price}</span>
                      <Coins className="w-6 h-6 text-yellow-400" />
                    </div>
                    <Button
                      onClick={() => purchaseItem(item)}
                      disabled={playerData.coins < item.price}
                      className="w-full"
                    >
                      Purchase
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card className="mt-6 bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle>Your Inventory</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <Calculator className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                    <p className="font-medium">Calculator Uses</p>
                    <p className="text-2xl font-bold text-blue-400">{inventory.calculatorUses}</p>
                  </div>
                  <div className="text-center">
                    <Sparkles className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                    <p className="font-medium">Formula Uses</p>
                    <p className="text-2xl font-bold text-purple-400">{inventory.formulaUses}</p>
                  </div>
                  <div className="text-center">
                    <Brain className="w-8 h-8 mx-auto mb-2 text-green-400" />
                    <p className="font-medium">Hint Uses</p>
                    <p className="text-2xl font-bold text-green-400">{inventory.hintUses}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "First Steps", description: "Solve your first problem", unlocked: true, icon: "🎯" },
                { name: "Streak Master", description: "Get a 10 problem streak", unlocked: true, icon: "🔥" },
                { name: "Speed Demon", description: "Solve a problem in under 10 seconds", unlocked: false, icon: "⚡" },
                { name: "Perfectionist", description: "Achieve 95% accuracy", unlocked: false, icon: "💎" },
                { name: "Coin Collector", description: "Earn 1000 coins", unlocked: false, icon: "💰" },
                { name: "Math Wizard", description: "Reach Expert rank", unlocked: false, icon: "🧙‍♂️" }
              ].map((achievement, index) => (
                <Card key={index} className={`bg-slate-800/50 border-slate-700 ${achievement.unlocked ? 'border-yellow-500/50' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <h3 className={`font-medium ${achievement.unlocked ? 'text-yellow-400' : 'text-slate-400'}`}>
                          {achievement.name}
                        </h3>
                        <p className="text-sm text-slate-500">{achievement.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="mt-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle>Global Leaderboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { rank: 1, name: "MathMaster2024", score: 15420, badge: "🥇" },
                    { rank: 2, name: "CalculusKing", score: 14890, badge: "🥈" },
                    { rank: 3, name: "AlgebraAce", score: 14230, badge: "🥉" },
                    { rank: 4, name: "GeometryGuru", score: 13850, badge: "" },
                    { rank: 5, name: "You", score: playerData.xp, badge: "", highlight: true }
                  ].map((player) => (
                    <div key={player.rank} className={`flex items-center justify-between p-3 rounded-lg ${
                      player.highlight ? 'bg-cyan-500/20 border border-cyan-500/50' : 'bg-slate-700/50'
                    }`}>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold w-8">{player.badge || `#${player.rank}`}</span>
                        <span className={player.highlight ? 'text-cyan-400 font-medium' : ''}>{player.name}</span>
                      </div>
                      <span className="font-bold text-yellow-400">{player.score.toLocaleString()} XP</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <NotepadPanel notepadOpen={notepadOpen} setNotepadOpen={setNotepadOpen} notepadContent={notepadContent} setNotepadContent={setNotepadContent} />
    </div>
  )

  // Game View (Enhanced)
  const GameView = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Game Header */}
        <div className="flex justify-between items-center mb-6">
          <Button
            onClick={() => setCurrentView('dashboard')}
            variant="outline"
            className="border-cyan-500/50 hover:border-cyan-400"
          >
            <span className="mr-2">🏠</span>
            Back to Dashboard
          </Button>

          <div className="flex items-center gap-6 text-lg">
            <div className="flex items-center gap-2">
              <Timer className={`w-5 h-5 ${gameState.timeLeft <= 10 ? 'text-red-400' : 'text-blue-400'}`} />
              <span className={gameState.timeLeft <= 10 ? 'text-red-400 font-bold' : 'text-blue-400'}>
                {gameState.timeLeft}s
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-400" />
              <span className="text-red-400">{playerData.health}/{playerData.maxHealth}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-purple-400">Level {gameState.dungeonLevel}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Game Area */}
          <div className="lg:col-span-3">
            {gameState.currentProblem && (
              <Card className="bg-slate-800/50 border-cyan-500/30 backdrop-blur">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-cyan-400">
                    <Brain className="w-5 h-5" />
                    {gameState.currentProblem.category.charAt(0).toUpperCase() + gameState.currentProblem.category.slice(1)} Problem
                    <Badge variant="outline" className="ml-auto">
                      Difficulty {gameState.currentProblem.difficulty}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">{gameState.currentProblem.question}</h2>

                    <Input
                      ref={inputRef} // Add ref to the input field
                      type="text"
                      placeholder="Enter your answer..."
                      value={currentAnswer}
                      onChange={(e) => setCurrentAnswer(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="text-center text-lg max-w-md mx-auto"
                      disabled={gameState.timeLeft === 0}
                    />

                    <div className="flex gap-2 justify-center mt-4">
                      <Button
                        onClick={submitAnswer}
                        className="pulse-glow"
                        disabled={!currentAnswer.trim() || gameState.timeLeft === 0}
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Submit Answer
                      </Button>
                      <Button variant="outline" onClick={useHint} disabled={showHint}>
                        <Brain className="w-4 h-4 mr-2" />
                        Hint {inventory.hintUses > 0 ? `(${inventory.hintUses} free)` : '(-5 XP)'}
                      </Button>
                    </div>

                    {showHint && (
                      <div className="bg-muted p-4 rounded-lg mt-4">
                        <p className="text-sm text-muted-foreground">
                          <strong>Hint:</strong> {gameState.currentProblem.hint}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Available Tools */}
                  <div className="border-t pt-4">
                    <h3 className="text-sm font-medium mb-2">Available Tools:</h3>
                    <div className="flex gap-2 flex-wrap">
                      {gameState.tools.map((tool, index) => (
                        <Button key={index} variant="outline" size="sm" onClick={() => useTool(tool)}> {/* Add onClick handler */}
                          <Calculator className="w-3 h-3 mr-1" />
                          {tool}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Game Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <Card className="bg-slate-800/50 border-green-500/30">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">{playerData.streak}</div>
                  <div className="text-sm text-slate-400">Current Streak</div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-blue-500/30">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">{playerData.totalProblems}</div>
                  <div className="text-sm text-slate-400">Total Solved</div>
                </CardContent>
              </Card>
              <Card className="bg-slate-800/50 border-yellow-500/30">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-400">{playerData.accuracy}%</div>
                  <div className="text-sm text-slate-400">Accuracy</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Notepad Side Panel */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800/50 border-slate-700 h-96">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <StickyNote className="w-4 h-4" />
                  Quick Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Textarea
                  value={notepadContent}
                  onChange={(e) => setNotepadContent(e.target.value)}
                  placeholder="Write your calculations here..."
                  className="w-full h-80 border-0 resize-none rounded-none bg-transparent"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="App">
      {currentView === 'dashboard' ? <DashboardView /> : <GameView />}
    </div>
  )
}

export default App

