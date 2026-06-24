import { Company, FinancialReport, InsiderTrade, PressRelease, IndexData } from '../types';

export const mockCompanies: Company[] = [
  {
    symbol: 'AVANTEL',
    name: 'Avantel Ltd.',
    marketCap: 4235,
    ltp: 184.20,
    chg: 2.45,
    sector: 'Defense & Aerospace Telecom',
    description: 'Avantel Ltd. is engaged in manufacturing wireless front-end, satellite communication, antennas, and radar systems for Indian Defense, Railways, and Space agencies.'
  },
  {
    symbol: 'COASTAL',
    name: 'Coastal Corporation Ltd.',
    marketCap: 892,
    ltp: 342.15,
    chg: 5.12,
    sector: 'Seafood Processing & Export',
    description: 'Coastal Corporation is a leading producer and exporter of high-quality frozen seafood products, primarily to markets in the United States, Europe, and Asia.'
  },
  {
    symbol: 'FRONTIER',
    name: 'Frontier Springs Ltd.',
    marketCap: 540,
    ltp: 841.00,
    chg: -1.21,
    sector: 'Industrial Springs & Engineering',
    description: 'Frontier Springs manufactures coil springs and leaf springs for railways, heavy vehicles, and defense applications, serving Indian Railways as a primary supplier.'
  },
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd.',
    marketCap: 1726500,
    ltp: 2845.50,
    chg: 1.15,
    sector: 'Conglomerate (Oil, Retail, Telecom)',
    description: 'Reliance Industries is India\'s largest private sector conglomerate with interests spanning hydrocarbon exploration, petroleum refining, retail services, and telecom (Jio).'
  },
  {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd.',
    marketCap: 1145000,
    ltp: 1512.40,
    chg: -0.45,
    sector: 'Banking & Financial Services',
    description: 'HDFC Bank is India\'s largest private sector bank by assets and the pioneer of retail financial services in India, offering world-class commercial banking.'
  },
  {
    symbol: 'INFY',
    name: 'Infosys Ltd.',
    marketCap: 622400,
    ltp: 1488.20,
    chg: -2.10,
    sector: 'IT Services & Consulting',
    description: 'Infosys is a global leader in next-generation digital services and consulting, enabling clients across 56 countries to navigate their digital transformation.'
  },
  {
    symbol: 'TATAMOTORS',
    name: 'Tata Motors Ltd.',
    marketCap: 312000,
    ltp: 924.80,
    chg: 3.84,
    sector: 'Automobile (Passenger & Commercial)',
    description: 'Tata Motors is a leading global automobile manufacturer of cars, utility vehicles, buses, trucks, and defense vehicles, including the luxury brand Jaguar Land Rover.'
  },
  {
    symbol: 'KPITTECH',
    name: 'KPIT Technologies Ltd.',
    marketCap: 45200,
    ltp: 1650.00,
    chg: 4.25,
    sector: 'Automotive Software Solutions',
    description: 'KPIT Technologies is a global partner to the automotive and mobility ecosystem, specializing in software development, electrification, autonomous driving, and connected cars.'
  }
];

export const mockFinancialReports: FinancialReport[] = [
  {
    id: 'fr_1',
    symbol: 'RELIANCE',
    companyName: 'Reliance Industries Ltd.',
    period: 'Q3 FY26',
    netProfit: 17265,
    ebitdaMargin: 18.4,
    revenue: 224500,
    publishedAt: '2026-06-23T09:45:00-07:00',
    summary: 'Reliance reported strong double-digit growth driven primarily by a robust recovery in retail sales volume and consistent subscriber growth on Jio. The hydrocarbon division experienced steady EBITDA margins of 18.4% despite geopolitical turbulence.'
  },
  {
    id: 'fr_2',
    symbol: 'AVANTEL',
    companyName: 'Avantel Ltd.',
    period: 'Q3 FY26',
    netProfit: 38.5,
    ebitdaMargin: 26.2,
    revenue: 142.3,
    publishedAt: '2026-06-22T14:30:00-07:00',
    summary: 'Avantel experienced exceptional growth in defense contract realizations. Operating margins expanded by 180bps to 26.2% due to localized component design and delivery of indigenous software-defined radios to the Indian Navy.'
  },
  {
    id: 'fr_3',
    symbol: 'HDFCBANK',
    companyName: 'HDFC Bank Ltd.',
    period: 'Q3 FY26',
    netProfit: 16370,
    ebitdaMargin: 4.8, // NIM in banking
    revenue: 57400,
    publishedAt: '2026-06-21T18:15:00-07:00',
    summary: 'HDFC Bank maintained a stable Net Interest Margin (NIM) of 4.8% post-merger integration. Asset quality remained pristine with Gross NPA dropping to 1.15% of gross advances, outperforming peer private banks.'
  },
  {
    id: 'fr_4',
    symbol: 'TATAMOTORS',
    companyName: 'Tata Motors Ltd.',
    period: 'Q3 FY26',
    netProfit: 7120,
    ebitdaMargin: 14.1,
    revenue: 110500,
    publishedAt: '2026-06-20T16:00:00-07:00',
    summary: 'Tata Motors net profit surged YoY fueled by Jaguar Land Rover (JLR) margin expansion, solid domestic commercial vehicle demand, and growing market share in passenger Electric Vehicles.'
  },
  {
    id: 'fr_5',
    symbol: 'COASTAL',
    companyName: 'Coastal Corporation Ltd.',
    period: 'Q3 FY26',
    netProfit: 12.8,
    ebitdaMargin: 11.2,
    revenue: 215.4,
    publishedAt: '2026-06-19T11:20:00-07:00',
    summary: 'Coastal Corp saw steady export volumes in value-added shrimp products to US retail networks. Freight expenses stabilized, leading to a recovery in operating EBITDA margin to 11.2%.'
  }
];

export const mockInsiderTrades: InsiderTrade[] = [
  {
    id: 'it_1',
    symbol: 'AVANTEL',
    companyName: 'Avantel Ltd.',
    insiderName: 'Deepak Kumar (Promoter)',
    action: 'Promoter Buying',
    shares: 150000,
    valueCr: 2.76,
    date: '2026-06-22'
  },
  {
    id: 'it_2',
    symbol: 'COASTAL',
    companyName: 'Coastal Corporation Ltd.',
    insiderName: 'G. V. R. Raju (Director)',
    action: 'Promoter Buying',
    shares: 45000,
    valueCr: 1.54,
    date: '2026-06-21'
  },
  {
    id: 'it_3',
    symbol: 'KPITTECH',
    companyName: 'KPIT Technologies Ltd.',
    insiderName: 'Aero-Dynamics Capital (Institutional)',
    action: 'Whales Buying',
    shares: 800000,
    valueCr: 132.0,
    date: '2026-06-20'
  },
  {
    id: 'it_4',
    symbol: 'FRONTIER',
    companyName: 'Frontier Springs Ltd.',
    insiderName: 'Kapil Bhatia (Promoter Group)',
    action: 'Promoter Buying',
    shares: 12000,
    valueCr: 1.01,
    date: '2026-06-18'
  },
  {
    id: 'it_5',
    symbol: 'RELIANCE',
    companyName: 'Reliance Industries Ltd.',
    insiderName: 'Jio Platforms Trust (Affiliate)',
    action: 'Merger',
    shares: 5000000,
    valueCr: 1422.0,
    date: '2026-06-15'
  }
];

export const mockPressReleases: PressRelease[] = [
  {
    id: 'pr_1',
    symbol: 'AVANTEL',
    companyName: 'Avantel Ltd.',
    title: 'Receipt of Purchase Order from Ministry of Defence',
    content: 'Avantel Ltd. has received a significant purchase order worth ₹45.8 Crores from the Ministry of Defence, Government of India, for the supply of state-of-the-art software-defined tactical communication systems. Delivery is scheduled to be completed within 12 months.',
    category: 'Corporate Action',
    publishedAt: '2026-06-23T11:30:00-07:00'
  },
  {
    id: 'pr_2',
    symbol: 'HDFCBANK',
    companyName: 'HDFC Bank Ltd.',
    title: 'HDFC Bank to Consider Interim Dividend',
    content: 'A meeting of the Board of Directors of HDFC Bank Ltd is scheduled on June 29, 2026, to consider and approve an interim dividend of ₹19.50 per equity share of face value ₹1 for the financial year ending March 31, 2026. The ex-dividend date will be July 5, 2026.',
    category: 'Corporate Action',
    publishedAt: '2026-06-21T09:00:00-07:00'
  },
  {
    id: 'pr_3',
    symbol: 'INFY',
    companyName: 'Infosys Ltd.',
    title: 'Collaboration with Leading European Telecom Operator',
    content: 'Infosys has announced a multi-year strategic partnership with a leading European telecom operator to accelerate their cloud-native infrastructure transformation. Infosys will deploy its AI-first platform, Topaz, to streamline network service provisioning and predictive maintenance.',
    category: 'Product Launch & Partnership',
    publishedAt: '2026-06-20T10:00:00-07:00'
  },
  {
    id: 'pr_4',
    symbol: 'FRONTIER',
    companyName: 'Frontier Springs Ltd.',
    title: 'Inauguration of New Manufacturing Line for High-Speed Train Springs',
    content: 'Frontier Springs Ltd. has successfully commissioned its state-of-the-art automatic coil spring production line at its Kanpur plant. This expansion caters specifically to high-speed LHB coaches and Vande Bharat trainsets, increasing manufacturing capacity by 40%.',
    category: 'Capex',
    publishedAt: '2026-06-19T15:45:00-07:00'
  }
];

export const mockNicheIndices: IndexData[] = [
  { name: 'TJI Metal Pipes', chg: 1450.4, pct: 27.84 },
  { name: 'TJI Transformers', chg: 890.1, pct: 24.61 },
  { name: 'TJI Recycling', chg: 1120.5, pct: 21.22 },
  { name: 'TJI Packaged Meat', chg: 650.3, pct: 22.05 }
];
