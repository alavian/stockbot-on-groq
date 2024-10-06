"use client"

import * as React from "react"
import { Bar, BarChart, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon, BarChart3Icon, BriefcaseIcon, LightbulbIcon, MessageCircle, PieChartIcon, RefreshCcw, SearchIcon, SendHorizonal, TrendingUpIcon, UserIcon, Users2Icon, ZapIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type UserType = "individual" | "advisor" | "investor-relations"

type Message = {
  role: "user" | "assistant"
  content: string
}

type Opportunity = {
  symbol: string
  name: string
  sector: string
  growth: number
  potential: number
}

type RelatedOpportunity = {
  symbol: string
  name: string
  sector: string
  relation: string
  growth: number
}

type SectorSentiment = {
  name: string
  sentiment: number
  comments: number
}

type StockSentiment = {
  symbol: string
  name: string
  sentiment: number
  comments: number
  recentComments: string[]
}

// Mock useGroq hook
function useGroq<T>(key: string, params?: any): { data: T | null; isLoading: boolean; error: Error | null; mutate: (updater?: (data: T) => T) => Promise<void> } {
  const [data, setData] = React.useState<T | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))
        let result: any
        switch (key) {
          case 'portfolio':
            result = [
              { symbol: "AAPL", name: "Apple Inc.", shares: 10, value: 1500, allocation: 30 },
              { symbol: "MSFT", name: "Microsoft Corporation", shares: 8, value: 2000, allocation: 40 },
              { symbol: "GOOGL", name: "Alphabet Inc.", shares: 5, value: 1000, allocation: 20 },
              { symbol: "AMZN", name: "Amazon.com Inc.", shares: 2, value: 500, allocation: 10 },
            ]
            break
          case 'opportunities':
            result = [
              { symbol: "NVDA", name: "NVIDIA Corporation", sector: "Technology", growth: 125, potential: 85 },
              { symbol: "TSLA", name: "Tesla, Inc.", sector: "Automotive", growth: 75, potential: 70 },
              { symbol: "PLTR", name: "Palantir Technologies", sector: "Software", growth: 60, potential: 80 },
            ]
            break
          case 'sectorSentiments':
            result = [
              { name: "Technology", sentiment: 0.7, comments: 1500 },
              { name: "Healthcare", sentiment: 0.3, comments: 1200 },
              { name: "Finance", sentiment: -0.2, comments: 1000 },
            ]
            break
          case 'stockSentiments':
            result = [
              { 
                symbol: "AAPL", 
                name: "Apple Inc.", 
                sentiment: 0.8, 
                comments: 500,
                recentComments: [
                  "Great new product lineup!",
                  "Concerned about supply chain issues",
                  "Strong financials this quarter"
                ]
              },
              { 
                symbol: "MSFT", 
                name: "Microsoft Corporation", 
                sentiment: 0.6, 
                comments: 450,
                recentComments: [
                  "Cloud business is booming",
                  "Potential antitrust issues",
                  "Excited about AI integrations"
                ]
              },
            ]
            break
          case 'performanceData':
            result = [
              { name: "Jan", value: 1000 },
              { name: "Feb", value: 1200 },
              { name: "Mar", value: 1100 },
              { name: "Apr", value: 1300 },
              { name: "May", value: 1600 },
              { name: "Jun", value: 1800 },
            ]
            break
          case 'diversificationData':
            result = [
              { name: "Technology", value: 40 },
              { name: "Healthcare", value: 20 },
              { name: "Finance", value: 15 },
              { name: "Consumer Goods", value: 15 },
              { name: "Energy", value: 10 },
            ]
            break
          case 'messages':
            result = [
              { role: "assistant", content: "Hello! I'm your AI financial advisor. How can I help you today?" },
            ]
            break
          case 'relatedOpportunities':
            result = [
              {
                symbol: "CARR",
                name: "Carrier Global Corporation",
                sector: "HVAC",
                relation: "Provides cooling systems for AI data centers",
                growth: 40
              },
              {
                symbol: "EQIX",
                name: "Equinix, Inc.",
                sector: "Data Centers",
                relation: "Operates data centers used for AI computing",
                growth: 35
              },
            ]
            break
          default:
            result = null
        }
        setData(result as T)
      } catch (err) {
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [key, JSON.stringify(params)])

  const mutate = async (updater?: (data: T) => T) => {
    if (updater && data) {
      const newData = updater(data)
      setData(newData)
    }
    // In a real implementation, you would also update the backend here
  }

  return { data, isLoading, error, mutate }
}

export default function IntegratedNofomoDashboard() {
  const [userType, setUserType] = React.useState<UserType>("individual")
  const [activeTab, setActiveTab] = React.useState("overview")
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedOpportunity, setSelectedOpportunity] = React.useState<Opportunity | null>(null)
  const [input, setInput] = React.useState("")

  const { data: portfolio, isLoading: isPortfolioLoading, error: portfolioError } = useGroq<any[]>('portfolio')
  const { data: opportunities, isLoading: isOpportunitiesLoading, error: opportunitiesError } = useGroq<Opportunity[]>('opportunities')
  const { data: sectorSentiments, isLoading: isSectorSentimentsLoading, error: sectorSentimentsError, mutate: refreshSectorSentiments } = useGroq<SectorSentiment[]>('sectorSentiments')
  const { data: stockSentiments, isLoading: isStockSentimentsLoading, error: stockSentimentsError, mutate: refreshStockSentiments } = useGroq<StockSentiment[]>('stockSentiments')
  const { data: performanceData, isLoading: isPerformanceDataLoading, error: performanceDataError } = useGroq<any[]>('performanceData')
  const { data: diversificationData, isLoading: isDiversificationDataLoading, error: diversificationDataError } = useGroq<any[]>('diversificationData')
  const { data: messages, isLoading: isMessagesLoading, error: messagesError, mutate: updateMessages } = useGroq<Message[]>('messages')

  const { data: relatedOpportunities, isLoading: isRelatedOpportunitiesLoading, error: relatedOpportunitiesError, mutate: updateRelatedOpportunities } = useGroq<RelatedOpportunity[]>('relatedOpportunities', { symbol: selectedOpportunity?.symbol })

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const opportunity = opportunities?.find(o => o.symbol.toLowerCase() === searchTerm.toLowerCase()) || null
    setSelectedOpportunity(opportunity)
    if (opportunity) {
      await updateRelatedOpportunities()
    }
    setSearchTerm("")
  }

  const handleSendMessage = async () => {
    if (input.trim() === "") return

    const userMessage: Message = { role: "user", content: input }
    await updateMessages((prevMessages) => [...prevMessages!, userMessage])
    setInput("")

    // Simulate AI response (replace with actual API call in production)
    setTimeout(async () => {
      const aiResponse: Message = { role: "assistant", content: generateAIResponse(input) }
      await updateMessages((prevMessages) => [...prevMessages!, aiResponse])
    }, 1000)
  }

  const generateAIResponse = (userInput: string): string => {
    const lowercaseInput = userInput.toLowerCase()
    if (lowercaseInput.includes("undervalued stocks")) {
      return "Based on our analysis, some potentially undervalued stocks to consider are: NVDA (NVIDIA Corporation), PLTR (Palantir Technologies), and CRWD (CrowdStrike Holdings). These companies show strong growth potential in emerging tech sectors."
    } else if (lowercaseInput.includes("sentiment")) {
      return "The overall market sentiment is currently bullish, especially in the Technology sector. However, there are some concerns in the Finance sector due to recent regulatory changes. It's important to consider both positive and negative sentiments when making investment decisions."
    } else if (lowercaseInput.includes("related opportunities")) {
      return "When looking at related opportunities, consider companies in supporting industries. For example, if you're interested in AI companies like NVIDIA, look into data center REITs, chip manufacturing equipment suppliers, and companies providing cooling solutions for high-performance computing."
    } else {
      return "I can help you find undervalued stocks, analyze market sentiment, and explore related opportunities in various sectors. Could you please specify which area you'd like to focus on?"
    }
  }

  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 0.5) return "bg-green-100 text-green-800"
    if (sentiment > 0) return "bg-lime-100 text-lime-800"
    if (sentiment === 0) return "bg-gray-100 text-gray-800"
    if (sentiment > -0.5) return "bg-orange-100 text-orange-800"
    return "bg-red-100 text-red-800"
  }

  const getSentimentLabel = (sentiment: number) => {
    if (sentiment > 0.5) return "Very Positive"
    if (sentiment > 0) return "Positive"
    if (sentiment === 0) return "Neutral"
    if (sentiment > -0.5) return "Negative"
    return "Very Negative"
  }

  const refreshSentiments = async () => {
    await refreshSectorSentiments()
    await refreshStockSentiments()
  }

  if (isPortfolioLoading || isOpportunitiesLoading || isSectorSentimentsLoading || isStockSentimentsLoading || isPerformanceDataLoading || isDiversificationDataLoading || isMessagesLoading) {
    return <div>Loading...</div>
  }

  if (portfolioError || opportunitiesError || sectorSentimentsError || stockSentimentsError || performanceDataError || diversificationDataError || messagesError) {
    return <div>Error loading data. Please try again later.</div>
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center h-16 px-4 border-b shrink-0 md:px-6">
        <Button variant="ghost" className="text-lg font-semibold mr-6">
          NOFOMO
        </Button>
        <nav className="flex-1 flex items-center space-x-4 lg:space-x-6">
          <Button variant="ghost" onClick={() => setActiveTab("overview")}>Overview</Button>
          <Button variant="ghost" onClick={() => setActiveTab("opportunities")}>Opportunities</Button>
          <Button variant="ghost" onClick={() => setActiveTab("sentiment")}>Sentiment</Button>
          <Button variant="ghost" onClick={() => setActiveTab("portfolio")}>Portfolio</Button>
          <Button variant="ghost" onClick={() => setActiveTab("advisor")}>AI Advisor</Button>
        </nav>
        <Select value={userType} onValueChange={(value: UserType) => setUserType(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select user type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="individual">
              <div className="flex items-center">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Individual</span>
              </div>
            </SelectItem>
            <SelectItem value="advisor">
              <div className="flex items-center">
                <BriefcaseIcon className="mr-2 h-4 w-4" />
                <span>Investment Advisor</span>
              </div>
            </SelectItem>
            <SelectItem value="investor-relations">
              <div className="flex items-center">
                <Users2Icon className="mr-2 h-4 w-4" />
                <span>Investor Relations</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        <Avatar className="h-9 w-9 ml-4">
          <AvatarImage src="/placeholder-avatar.jpg" alt="Avatar" />
          <AvatarFallback>OP</AvatarFallback>
        </Avatar>
      </header>
      <main className="flex-1 overflow-y-auto py-6 px-4 md:px-6">
        <h1 className="text-3xl font-bold mb-4">NOFOMO Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Top Opportunity</CardTitle>
              <TrendingUpIcon className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{opportunities![0].name} ({opportunities![0].symbol})</div>
              <p className="text-xs text-muted-foreground">{opportunities![0].growth}% YoY Growth</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
              <ArrowUpIcon className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${portfolio!.reduce((sum, stock) => sum + stock.value, 0).toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">+2.5% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Market Sentiment</CardTitle>
              <PieChartIcon className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getSentimentLabel(sectorSentiments!.reduce((sum, sector) => sum + sector.sentiment, 0) / sectorSentiments!.length)}</div>
              <p className="text-xs text-muted-foreground">Across all sectors</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">AI Advisor</CardTitle>
              <MessageCircle className="w-4 h-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Active</div>
              <p className="text-xs text-muted-foreground">Ready to assist you</p>
            </CardContent>
          </Card>
        </div>

        {activeTab === "overview" && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Market Overview</CardTitle>
              <CardDescription>Key insights and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Top Performing Sectors</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={sectorSentiments}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="sentiment" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Portfolio Performance</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={performanceData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                {userType === "advisor" && (
                  <div>
                    <h3 className="text-lg font-semibold">Client Portfolio Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={diversificationData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          label
                        />
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
                {userType === "investor-relations" && (
                  <div>
                    <h3 className="text-lg font-semibold">Investor Sentiment Trends</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={performanceData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#82ca9d" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "opportunities" && (
          <>
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Opportunity Explorer</CardTitle>
                <CardDescription>Discover undervalued stocks and related opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="flex space-x-2 mb-4">
                  <Input
                    placeholder="Enter stock symbol (e.g., NVDA)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button type="submit">Analyze</Button>
                </form>
                {selectedOpportunity && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold">{selectedOpportunity.name} ({selectedOpportunity.symbol})</h3>
                      <p className="text-sm text-muted-foreground">Sector: {selectedOpportunity.sector}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Growth Rate</p>
                        <p className="text-2xl font-bold text-green-600">{selectedOpportunity.growth}%</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Growth Potential</p>
                        <p className="text-2xl font-bold text-blue-600">{selectedOpportunity.potential}%</p>
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={performanceData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#8884d8" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
            {relatedOpportunities && relatedOpportunities.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Related Opportunities</CardTitle>
                  <CardDescription>Explore opportunities in tertiary sectors related to {selectedOpportunity?.symbol}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Symbol</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Sector</TableHead>
                        <TableHead>Relation</TableHead>
                        <TableHead>Growth</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {relatedOpportunities.map((opportunity) => (
                        <TableRow key={opportunity.symbol}>
                          <TableCell className="font-medium">{opportunity.symbol}</TableCell>
                          <TableCell>{opportunity.name}</TableCell>
                          <TableCell>{opportunity.sector}</TableCell>
                          <TableCell>{opportunity.relation}</TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              {opportunity.growth}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {activeTab === "sentiment" && (
          <>
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Sector Sentiment Analysis</CardTitle>
                <CardDescription>Based on recent comments from Yahoo Finance and Reddit</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Sector Sentiments</h2>
                  <Button onClick={refreshSentiments}>
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Refresh Data
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sector</TableHead>
                      <TableHead>Sentiment</TableHead>
                      <TableHead>Comments</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sectorSentiments!.map((sector) => (
                      <TableRow key={sector.name}>
                        <TableCell className="font-medium">{sector.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={getSentimentColor(sector.sentiment)}>
                            {getSentimentLabel(sector.sentiment)}
                          </Badge>
                        </TableCell>
                        <TableCell>{sector.comments}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Stock Sentiment Analysis</CardTitle>
                <CardDescription>Analyze sentiment for specific stocks</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Sentiment</TableHead>
                      <TableHead>Comments</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockSentiments!.map((stock) => (
                      <TableRow key={stock.symbol}>
                        <TableCell className="font-medium">{stock.symbol}</TableCell>
                        <TableCell>{stock.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={getSentimentColor(stock.sentiment)}>
                            {getSentimentLabel(stock.sentiment)}
                          </Badge>
                        </TableCell>
                        <TableCell>{stock.comments}</TableCell>
                        <TableCell>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <ArrowRightIcon className="h-4 w-4" />
                            <span className="sr-only">View details</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === "portfolio" && (
          <>
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>{userType === "individual" ? "Your Portfolio" : "Client Portfolio"}</CardTitle>
                <CardDescription>Overview of current stock holdings</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Shares</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Allocation</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {portfolio!.map((stock) => (
                      <TableRow key={stock.symbol}>
                        <TableCell className="font-medium">{stock.symbol}</TableCell>
                        <TableCell>{stock.name}</TableCell>
                        <TableCell>{stock.shares}</TableCell>
                        <TableCell>${stock.value}</TableCell>
                        <TableCell>{stock.allocation}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Portfolio Diversification</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={diversificationData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label
                    />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            {userType === "advisor" && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Client Risk Profiles</CardTitle>
                  <CardDescription>Overview of client risk tolerance distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { name: "Conservative", value: 30 },
                      { name: "Moderate", value: 45 },
                      { name: "Aggressive", value: 25 },
                    ]}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
            {userType === "investor-relations" && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Shareholder Composition</CardTitle>
                  <CardDescription>Breakdown of institutional vs. retail investors</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Institutional", value: 70 },
                          { name: "Retail", value: 30 },
                        ]}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#82ca9d"
                        label
                      />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {activeTab === "advisor" && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>AI Financial Advisor Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                {messages!.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    } mb-4`}
                  >
                    <div className={`flex ${message.role === "user" ? "flex-row-reverse" : "flex-row"} items-start`}>
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>{message.role === "user" ? "U" : "AI"}</AvatarFallback>
                        <AvatarImage src={message.role === "user" ? "/user-avatar.png" : "/ai-avatar.png"} />
                      </Avatar>
                      <div
                        className={`mx-2 p-3 rounded-lg ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendMessage()
                }}
                className="flex w-full items-center space-x-2"
              >
                <Input
                  id="message"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={isMessagesLoading}>
                  <SendHorizonal className="h-4 w-4" />
                  <span className="sr-only">Send message</span>
                </Button>
              </form>
            </CardFooter>
          </Card>
        )}
      </main>
      <footer className="flex items-center h-16 px-4 border-t shrink-0 md:px-6">
        <p className="text-sm text-muted-foreground">© 2023 NOFOMO. All rights reserved.</p>
      </footer>
    </div>
  )
}