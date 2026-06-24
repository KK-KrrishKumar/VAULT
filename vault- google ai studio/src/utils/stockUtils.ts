import { mockCompanies } from '../data/mockData';

export const getSector = (symbol: string): string => {
  const sym = symbol.toUpperCase().trim();
  const sectorMap: Record<string, string> = {
    'AVANTEL': 'Defense & Aerospace Telecom',
    'COASTAL': 'Seafood Processing & Export',
    'FRONTIER': 'Industrial Springs & Engineering',
    'RELIANCE': 'Diversified Conglomerate (Oil, Retail, Telecom)',
    'HDFCBANK': 'Banking & Financial Services',
    'INFY': 'IT Services & Consulting',
    'TATAMOTORS': 'Automobile (Passenger & Commercial)',
    'KPITTECH': 'Automotive Software Solutions',
    'TCS': 'IT Services & Consulting',
    'WIPRO': 'IT Services & Consulting',
    'HCLTECH': 'IT Services & Consulting',
    'ICICIBANK': 'Banking & Financial Services',
    'SBIN': 'Banking & Financial Services',
    'AXISBANK': 'Banking & Financial Services',
    'KOTAKBANK': 'Banking & Financial Services',
    'M&M': 'Automobile (Passenger & Commercial)',
    'MARUTI': 'Automobile (Passenger & Commercial)',
    'ASHOKLEY': 'Automobile (Passenger & Commercial)',
    'LTIM': 'IT Services & Consulting',
    'TATAELXSI': 'Automotive Software Solutions',
    'LTTS': 'Automotive Software Solutions',
    'COFORGE': 'IT Services & Consulting'
  };

  if (sectorMap[sym]) return sectorMap[sym];
  
  // Try to determine based on suffix or keywords
  if (sym.includes('BANK')) return 'Banking & Financial Services';
  if (sym.includes('CHEM')) return 'Chemicals & Fertilizers';
  if (sym.includes('PHARMA') || sym.includes('BIOC')) return 'Pharmaceuticals & Biotech';
  if (sym.includes('TECP') || sym.includes('SOFT') || sym.includes('INF') || sym.includes('SYS')) return 'IT Services & Consulting';
  if (sym.includes('MOTOR') || sym.includes('AUTO')) return 'Automobile & Mobility';
  if (sym.includes('STEEL') || sym.includes('IRON') || sym.includes('METAL')) return 'Metals & Mining';
  if (sym.includes('POWER') || sym.includes('ENERGY') || sym.includes('SOLAR')) return 'Renewable Energy & Power';

  // Hashing fallback
  const hash = sym.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const sectors = [
    'Banking & Financial Services',
    'IT Services & Consulting',
    'Automobile & Mobility',
    'Conglomerate (Oil, Retail, Telecom)',
    'Defense Electronics & Aerospace',
    'Pharmaceuticals & Biotech',
    'Renewable Energy & Infrastructure',
    'FMCG & Consumer Goods'
  ];
  return sectors[hash % sectors.length];
};

export const getDerivedMetrics = (symbol: string) => {
  const sym = symbol.toUpperCase().trim();
  const isMocked = mockCompanies.find(c => c.symbol.toUpperCase() === sym);
  const hash = sym.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  let marketCap = isMocked ? isMocked.marketCap : ((hash % 800) + 12) * 15;
  let pe = 22.1;
  let roe = '15.4%';
  let roce = '18.2%';
  let promShare = 52.4;
  let divYield = '1.25%';
  let debtToEquity = '0.12';
  let highLow = '';

  // Realistic parameters based on real-world Indian stocks or mock database
  if (sym === 'AVANTEL') {
    pe = 44.8;
    roe = '28.4%';
    roce = '34.1%';
    promShare = 40.1;
    divYield = '0.54%';
    debtToEquity = '0.08';
    highLow = '₹210 / ₹125';
  } else if (sym === 'COASTAL') {
    pe = 18.2;
    roe = '12.5%';
    roce = '14.8%';
    promShare = 55.2;
    divYield = '1.10%';
    debtToEquity = '0.45';
    highLow = '₹410 / ₹295';
  } else if (sym === 'FRONTIER') {
    pe = 24.5;
    roe = '16.8%';
    roce = '19.4%';
    promShare = 62.1;
    divYield = '0.90%';
    debtToEquity = '0.15';
    highLow = '₹980 / ₹720';
  } else if (sym === 'RELIANCE') {
    pe = 26.4;
    roe = '18.5%';
    roce = '21.2%';
    promShare = 50.3;
    divYield = '1.25%';
    debtToEquity = '0.38';
    highLow = '₹3150 / ₹2210';
  } else if (sym === 'HDFCBANK') {
    pe = 19.5;
    roe = '17.2%';
    roce = '22.4%';
    promShare = 0.0; // FII/DII owned mainly
    divYield = '1.50%';
    debtToEquity = '0.85'; // Higher for banks
    highLow = '₹1750 / ₹1380';
  } else if (sym === 'INFY') {
    pe = 25.8;
    roe = '31.2%';
    roce = '38.4%';
    promShare = 14.9;
    divYield = '2.40%';
    debtToEquity = '0.02';
    highLow = '₹1720 / ₹1350';
  } else if (sym === 'TATAMOTORS') {
    pe = 16.4;
    roe = '24.1%';
    roce = '21.8%';
    promShare = 46.4;
    divYield = '0.85%';
    debtToEquity = '0.95';
    highLow = '₹1065 / ₹780';
  } else if (sym === 'KPITTECH') {
    pe = 62.5;
    roe = '26.8%';
    roce = '31.2%';
    promShare = 39.5;
    divYield = '0.35%';
    debtToEquity = '0.11';
    highLow = '₹1920 / ₹1320';
  } else {
    // Generate realistic ranges based on hash
    pe = Number(((hash % 35) + 14).toFixed(1));
    roe = `${((hash % 16) + 10).toFixed(1)}%`;
    roce = `${((hash % 18) + 12).toFixed(1)}%`;
    promShare = Number(((hash % 35) + 40).toFixed(1));
    divYield = `${((hash % 4) * 0.4 + 0.3).toFixed(2)}%`;
    debtToEquity = `${((hash % 10) * 0.08 + 0.05).toFixed(2)}`;
    
    const approxLtp = isMocked ? isMocked.ltp : ((hash % 1400) + 95);
    highLow = `₹${(approxLtp * 1.22).toFixed(0)} / ₹${(approxLtp * 0.78).toFixed(0)}`;
  }

  return { marketCap, pe, roe, roce, promShare, divYield, debtToEquity, highLow };
};

export const getVaultRating = (symbol: string, metrics: any) => {
  const sym = symbol.toUpperCase().trim();
  
  // Custom static profiles for mock and famous companies to show beautiful unique scores!
  let score = 75;
  let grade = 'AA';
  let label = 'Strong Grade';
  let description = 'Highly attractive efficiency standards with clean regulatory compliance.';
  let colors = {
    bg: 'bg-emerald-50/70',
    border: 'border-emerald-200',
    text: 'text-emerald-800',
    accent: 'emerald'
  };

  if (sym === 'AVANTEL') {
    score = 94;
    grade = 'AAA';
    label = 'Defense Sector Leader';
    description = 'Exceptional order book visibility, superb capital returns (ROCE 34.1%), and zero debt risk.';
    colors = { bg: 'bg-indigo-50/70', border: 'border-indigo-200', text: 'text-indigo-800', accent: 'indigo' };
  } else if (sym === 'RELIANCE') {
    score = 86;
    grade = 'AA';
    label = 'Conglomerate Heavyweight';
    description = 'Dominant energy, telecom, and retail moat. Highly stable Cash-on-Cash yields.';
    colors = { bg: 'bg-slate-50', border: 'border-slate-300', text: 'text-slate-800', accent: 'slate' };
  } else if (sym === 'HDFCBANK') {
    score = 88;
    grade = 'AA';
    label = 'Banking Standard';
    description = 'Pristine asset quality, premium NIM at 4.8%, and legendary risk governance framework.';
    colors = { bg: 'bg-blue-50/70', border: 'border-blue-200', text: 'text-blue-800', accent: 'blue' };
  } else if (sym === 'INFY') {
    score = 89;
    grade = 'AA';
    label = 'Global IT Moat';
    description = 'Extremely high capital efficiency (ROE 31.2%), pristine balance sheet, and substantial free cash generation.';
    colors = { bg: 'bg-cyan-50/70', border: 'border-cyan-200', text: 'text-cyan-800', accent: 'cyan' };
  } else if (sym === 'TATAMOTORS') {
    score = 82;
    grade = 'AA';
    label = 'Automotive Outperformer';
    description = 'Rising electric vehicle market share, powerful JLR turnaround, and strong commercial vehicle demand.';
    colors = { bg: 'bg-emerald-50/70', border: 'border-emerald-200', text: 'text-emerald-800', accent: 'emerald' };
  } else if (sym === 'KPITTECH') {
    score = 78;
    grade = 'A+';
    label = 'High Growth Tech';
    description = 'High valuation PE multiple is backed by premium niche ER&D services in the smart mobility space.';
    colors = { bg: 'bg-purple-50/70', border: 'border-purple-200', text: 'text-purple-800', accent: 'purple' };
  } else if (sym === 'COASTAL') {
    score = 64;
    grade = 'BBB';
    label = 'Agri Export Cyclical';
    description = 'Steady international volumes with exposure to dollar-rupee fluctuations and freight cyclicality.';
    colors = { bg: 'bg-amber-50/70', border: 'border-amber-200', text: 'text-amber-800', accent: 'amber' };
  } else if (sym === 'FRONTIER') {
    score = 72;
    grade = 'A';
    label = 'Railway Component Core';
    description = 'Consistent supply contracts for high-speed LHB coaches, though dependent on government capital budgets.';
    colors = { bg: 'bg-teal-50/70', border: 'border-teal-200', text: 'text-teal-800', accent: 'teal' };
  } else {
    // Generate deterministic distinct ratings based on hash so they don't look all the same!
    const hash = sym.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    score = 55 + (hash % 38); // Distinct scores between 55 and 93
    if (score >= 88) {
      grade = 'AAA';
      label = 'Elite Tier';
      description = 'Exceptional debt-to-equity ratio, robust core sector leadership, and strong return parameters.';
      colors = { bg: 'bg-slate-50', border: 'border-slate-300', text: 'text-slate-800', accent: 'slate' };
    } else if (score >= 78) {
      grade = 'AA';
      label = 'High Grade Standard';
      description = 'Solid financial metrics, clean corporate governance record, and stable return metrics.';
      colors = { bg: 'bg-emerald-50/70', border: 'border-emerald-200', text: 'text-emerald-800', accent: 'emerald' };
    } else if (score >= 68) {
      grade = 'A';
      label = 'Moderate Moat';
      description = 'Established operational profit margins with standard industry risk variables.';
      colors = { bg: 'bg-blue-50/70', border: 'border-blue-200', text: 'text-blue-800', accent: 'blue' };
    } else {
      grade = 'BBB';
      label = 'Cyclical Value';
      description = 'Subject to global cyclical pressures. Moderately leveraged balance sheet profile.';
      colors = { bg: 'bg-amber-50/70', border: 'border-amber-200', text: 'text-amber-800', accent: 'amber' };
    }
  }

  // Generate distinctive sub-component scores to match the final score!
  const variation = (score % 7) - 3;
  const valuationScore = Math.max(20, Math.min(100, Math.round(score + variation * 2)));
  const ownershipScore = Math.max(20, Math.min(100, Math.round(score - variation * 1.5)));
  const leverageScore = Math.max(20, Math.min(100, Math.round(score + variation * 3)));
  const efficiencyScore = Math.max(20, Math.min(100, Math.round(score - variation * 2.5)));

  return {
    score,
    grade,
    color: `${colors.text} ${colors.border} ${colors.bg}`,
    label,
    description,
    breakdown: [
      { name: 'Valuation Safety', value: valuationScore },
      { name: 'Ownership Structure', value: ownershipScore },
      { name: 'Financial Leverage', value: leverageScore },
      { name: 'Capital Efficiency', value: efficiencyScore }
    ]
  };
};

export const getDynamicPeers = (symbol: string) => {
  const sym = symbol.toUpperCase().trim();
  
  // Custom real peers for standard stocks
  const peersMap: Record<string, { symbol: string; name: string; marketCap: number; pe: number; roce: string; debtToEquity: string }[]> = {
    'AVANTEL': [
      { symbol: 'BEL', name: 'Bharat Electronics Ltd.', marketCap: 185200, pe: 34.5, roce: '28.5%', debtToEquity: '0.01' },
      { symbol: 'DATAPATTERNS', name: 'Data Patterns (India) Ltd.', marketCap: 15400, pe: 58.2, roce: '24.2%', debtToEquity: '0.05' },
      { symbol: 'MTARTECH', name: 'MTAR Technologies Ltd.', marketCap: 6420, pe: 41.6, roce: '18.9%', debtToEquity: '0.18' }
    ],
    'COASTAL': [
      { symbol: 'APEX', name: 'Apex Frozen Foods Ltd.', marketCap: 720, pe: 16.1, roce: '11.4%', debtToEquity: '0.38' },
      { symbol: 'WATERBASE', name: 'The Waterbase Ltd.', marketCap: 450, pe: 21.4, roce: '9.2%', debtToEquity: '0.22' },
      { symbol: 'ZEAL', name: 'Zeal Aqua Ltd.', marketCap: 180, pe: 14.5, roce: '8.4%', debtToEquity: '0.55' }
    ],
    'FRONTIER': [
      { symbol: 'JWL', name: 'Jupiter Wagons Ltd.', marketCap: 16800, pe: 38.5, roce: '21.4%', debtToEquity: '0.12' },
      { symbol: 'TEXRAIL', name: 'Texmaco Rail & Engineering Ltd.', marketCap: 8400, pe: 42.1, roce: '14.5%', debtToEquity: '0.45' },
      { symbol: 'BEML', name: 'BEML Ltd.', marketCap: 14200, pe: 45.8, roce: '12.8%', debtToEquity: '0.28' }
    ],
    'RELIANCE': [
      { symbol: 'IOC', name: 'Indian Oil Corporation Ltd.', marketCap: 234000, pe: 11.2, roce: '14.2%', debtToEquity: '0.68' },
      { symbol: 'BPCL', name: 'Bharat Petroleum Corporation Ltd.', marketCap: 135000, pe: 10.4, roce: '15.1%', debtToEquity: '0.58' },
      { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd.', marketCap: 742000, pe: 54.2, roce: '12.4%', debtToEquity: '1.24' }
    ],
    'HDFCBANK': [
      { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.', marketCap: 785000, pe: 17.4, roce: '16.8%', debtToEquity: '0.78' },
      { symbol: 'SBIN', name: 'State Bank of India', marketCap: 652000, pe: 9.5, roce: '15.4%', debtToEquity: '0.82' },
      { symbol: 'AXISBANK', name: 'Axis Bank Ltd.', marketCap: 342000, pe: 14.2, roce: '16.1%', debtToEquity: '0.80' }
    ],
    'INFY': [
      { symbol: 'TCS', name: 'Tata Consultancy Services Ltd.', marketCap: 1452000, pe: 28.5, roce: '44.8%', debtToEquity: '0.01' },
      { symbol: 'HCLTECH', name: 'HCL Technologies Ltd.', marketCap: 412000, pe: 22.4, roce: '29.1%', debtToEquity: '0.05' },
      { symbol: 'WIPRO', name: 'Wipro Ltd.', marketCap: 245000, pe: 19.8, roce: '21.5%', debtToEquity: '0.04' }
    ],
    'TATAMOTORS': [
      { symbol: 'M&M', name: 'Mahindra & Mahindra Ltd.', marketCap: 284000, pe: 18.2, roce: '19.4%', debtToEquity: '0.65' },
      { symbol: 'MARUTI', name: 'Maruti Suzuki India Ltd.', marketCap: 395000, pe: 27.4, roce: '18.1%', debtToEquity: '0.01' },
      { symbol: 'ASHOKLEY', name: 'Ashok Leyland Ltd.', marketCap: 52000, pe: 21.5, roce: '16.4%', debtToEquity: '0.35' }
    ],
    'KPITTECH': [
      { symbol: 'TATAELXSI', name: 'Tata Elxsi Ltd.', marketCap: 48200, pe: 54.5, roce: '39.8%', debtToEquity: '0.02' },
      { symbol: 'LTTS', name: 'L&T Technology Services Ltd.', marketCap: 52400, pe: 38.1, roce: '28.4%', debtToEquity: '0.04' },
      { symbol: 'PERSISTENT', name: 'Persistent Systems Ltd.', marketCap: 58900, pe: 44.2, roce: '27.5%', debtToEquity: '0.03' }
    ]
  };

  if (peersMap[sym]) return peersMap[sym];

  // If a random ticker is loaded, let's generate 3 highly realistic same-sector peers!
  const hash = sym.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const sector = getSector(sym);
  const metrics = getDerivedMetrics(sym);

  const prefix = sym.substring(0, Math.min(sym.length, 4));

  return [
    {
      symbol: `${prefix}IND`.toUpperCase(),
      name: `${prefix.charAt(0) + prefix.slice(1).toLowerCase()} Industries Ltd.`,
      marketCap: Math.round(metrics.marketCap * 1.4),
      pe: Number((metrics.pe * 1.15).toFixed(1)),
      roce: `${((hash % 10) + 12).toFixed(1)}%`,
      debtToEquity: `${((hash % 8) * 0.08 + 0.1).toFixed(2)}`
    },
    {
      symbol: `${prefix}ENT`.toUpperCase(),
      name: `${prefix.charAt(0) + prefix.slice(1).toLowerCase()} Enterprises Ltd.`,
      marketCap: Math.round(metrics.marketCap * 0.65),
      pe: Number((metrics.pe * 0.85).toFixed(1)),
      roce: `${((hash % 8) + 15).toFixed(1)}%`,
      debtToEquity: `${((hash % 12) * 0.05 + 0.05).toFixed(2)}`
    },
    {
      symbol: `${prefix}GLO`.toUpperCase(),
      name: `${prefix.charAt(0) + prefix.slice(1).toLowerCase()} Global Ltd.`,
      marketCap: Math.round(metrics.marketCap * 0.45),
      pe: Number((metrics.pe * 0.95).toFixed(1)),
      roce: `${((hash % 12) + 10).toFixed(1)}%`,
      debtToEquity: `${((hash % 6) * 0.04 + 0.02).toFixed(2)}`
    }
  ];
};

export const getRecentNotices = (symbol: string) => {
  const sym = symbol.toUpperCase().trim();

  if (sym === 'AVANTEL') {
    return [
      {
        title: 'Receipt of purchase order worth ₹45.8 Crores from Ministry of Defence',
        date: 'June 23, 2026',
        category: 'Business Orders',
        daysAgo: 'Today'
      },
      {
        title: 'Outcome of Board Meeting: Approval of Audited Financials for FY26',
        date: 'May 26, 2026',
        category: 'Board Meetings',
        daysAgo: '28 days ago'
      },
      {
        title: 'Submission of Shareholding Pattern under SEBI LODR Regulation 31',
        date: 'April 15, 2026',
        category: 'Compliances',
        daysAgo: '69 days ago'
      },
      {
        title: 'Press Release on Successful Commissioning of High-Frequency SATCOM Terminals',
        date: 'March 28, 2026',
        category: 'Business Updates',
        daysAgo: '87 days ago'
      }
    ];
  } else if (sym === 'RELIANCE') {
    return [
      {
        title: 'Press Release: Jio Announces Premium Tariff Restructuring and High-Speed FTTX',
        date: 'June 20, 2026',
        category: 'Press Release',
        daysAgo: '3 days ago'
      },
      {
        title: 'Execution of Bandwidth & Enterprise 5G Contract with Centre for Railway Information Systems (CRIS)',
        date: 'June 18, 2026',
        category: 'Business Contracts',
        daysAgo: '5 days ago'
      },
      {
        title: 'Outcome of Board Meeting: Recommendation of Final Dividend for FY26',
        date: 'May 18, 2026',
        category: 'Dividends',
        daysAgo: '36 days ago'
      },
      {
        title: 'Submission of Investor Presentation for Q4 Earnings Call & Capex Guidance',
        date: 'April 25, 2026',
        category: 'Investor Meetings',
        daysAgo: '59 days ago'
      }
    ];
  } else if (sym === 'HDFCBANK') {
    return [
      {
        title: 'Intimation of Board Meeting under SEBI LODR to consider and approve Interim Dividend',
        date: 'June 21, 2026',
        category: 'Dividends',
        daysAgo: '2 days ago'
      },
      {
        title: 'Filing of Basel III Pillar 3 Disclosures for the Quarter ended March 31, 2026',
        date: 'May 30, 2026',
        category: 'Regulatory',
        daysAgo: '24 days ago'
      },
      {
        title: 'Disclosure of Credit Rating Affirmation from CRISIL & CARE Ratings',
        date: 'April 28, 2026',
        category: 'Credit Ratings',
        daysAgo: '56 days ago'
      },
      {
        title: 'Press Release on Launch of Next-Generation Digital Banking platform "SmartWealth"',
        date: 'March 15, 2026',
        category: 'Product Launch',
        daysAgo: '100 days ago'
      }
    ];
  } else if (sym === 'INFY') {
    return [
      {
        title: 'Press Release: Strategic Collaboration with Leading European Telecom Operator for AI Cloud-Native transformation',
        date: 'June 20, 2026',
        category: 'Strategic Alliance',
        daysAgo: '3 days ago'
      },
      {
        title: 'Outcome of Board Meeting: Approval of Q4 Standalone and Consolidated Audited Financial Results',
        date: 'May 20, 2026',
        category: 'Financials',
        daysAgo: '34 days ago'
      },
      {
        title: 'Notification of Allocation of Equity Shares under Employee Stock Option Scheme (ESOP)',
        date: 'April 18, 2026',
        category: 'Share Capital',
        daysAgo: '66 days ago'
      },
      {
        title: 'Intimation of schedule of Investor Conferences and Analyst Meetings',
        date: 'March 10, 2026',
        category: 'Investor Meet',
        daysAgo: '105 days ago'
      }
    ];
  } else if (sym === 'TATAMOTORS') {
    return [
      {
        title: 'Secured Fleet Electrification Contract for 1,500 Zero-Emission AC Electric Buses from DTC',
        date: 'June 19, 2026',
        category: 'Contracts Win',
        daysAgo: '4 days ago'
      },
      {
        title: 'Press Release on Jaguar Land Rover (JLR) Global Retail Volumes & Earnings Margins',
        date: 'June 05, 2026',
        category: 'Press Release',
        daysAgo: '18 days ago'
      },
      {
        title: 'Outcome of Board Meeting: Approval of Standalone Audited Results & Dividend Recommendation',
        date: 'May 22, 2026',
        category: 'Board Meetings',
        daysAgo: '32 days ago'
      },
      {
        title: 'Submission of Press Release on Sales Volume Performance for FY26',
        date: 'April 02, 2026',
        category: 'Operational Volume',
        daysAgo: '82 days ago'
      }
    ];
  } else if (sym === 'KPITTECH') {
    return [
      {
        title: 'Acquired Engineering Service Agreement from German Premium Luxury OEM for Autonomous Software Middleware',
        date: 'June 19, 2026',
        category: 'Contracts Win',
        daysAgo: '4 days ago'
      },
      {
        title: 'Press Release: KPIT wins prestigious Automotive software supplier award in Munich',
        date: 'May 28, 2026',
        category: 'Press Release',
        daysAgo: '26 days ago'
      },
      {
        title: 'Outcome of Board Meeting: Financial Results and Dividend recommendation for FY26',
        date: 'May 14, 2026',
        category: 'Financials',
        daysAgo: '40 days ago'
      },
      {
        title: 'Disclosure under SEBI Regulation 30 - Analysts and Institutional Investors Meet schedules',
        date: 'April 08, 2026',
        category: 'Investor Meetings',
        daysAgo: '76 days ago'
      }
    ];
  } else if (sym === 'COASTAL') {
    return [
      {
        title: 'Signed Export Supply Contract with US Food Grocery distributor for value-added seafood',
        date: 'June 22, 2026',
        category: 'Export Orders',
        daysAgo: '1 day ago'
      },
      {
        title: 'Press Release on Commissioning of New IQF (Individual Quick Freezing) Production Line',
        date: 'May 19, 2026',
        category: 'Operational Capex',
        daysAgo: '35 days ago'
      },
      {
        title: 'Outcome of Board Meeting: Audited Standalone Financials for FY26',
        date: 'May 12, 2026',
        category: 'Financials',
        daysAgo: '42 days ago'
      },
      {
        title: 'Intimation of Board Meeting for the consideration of Capex Allocations',
        date: 'April 15, 2026',
        category: 'Board Meetings',
        daysAgo: '69 days ago'
      }
    ];
  } else if (sym === 'FRONTIER') {
    return [
      {
        title: 'Secured heavy bolster coil springs supply contract from Chittaranjan Locomotive Works (CLW)',
        date: 'June 21, 2026',
        category: 'Rail Contracts',
        daysAgo: '2 days ago'
      },
      {
        title: 'Commissioned Automated Coil Spring production line for high-speed LHB Vande Bharat coaches',
        date: 'June 19, 2026',
        category: 'Production Line',
        daysAgo: '4 days ago'
      },
      {
        title: 'Outcome of Board Meeting: Financial Results and Performance Statement',
        date: 'May 15, 2026',
        category: 'Financials',
        daysAgo: '39 days ago'
      },
      {
        title: 'Disclosure of Promoter Share Purchase under Regulation 29(2) of SEBI SAST Regulations',
        date: 'April 18, 2026',
        category: 'Insider Filings',
        daysAgo: '66 days ago'
      }
    ];
  } else {
    // Dynamic generator based on the sector of the stock to make it incredibly lifelike!
    const sector = getSector(sym);
    const hash = sym.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    let sectorAction = 'Greenfield expansion and equipment procurement approved';
    let sectorCat = 'Operational Capex';
    if (sector.includes('Bank')) {
      sectorAction = 'Integration of Core Banking system and rural digital services expansion';
      sectorCat = 'Product Update';
    } else if (sector.includes('IT')) {
      sectorAction = 'Multi-year legacy system modernization contract signed with US Health Service consortium';
      sectorCat = 'Contract Received';
    } else if (sector.includes('Defense')) {
      sectorAction = 'Secured Navy Radar maintenance contract worth ₹18 Crores from Defense Ministry';
      sectorCat = 'Contract Received';
    } else if (sector.includes('Auto')) {
      sectorAction = 'Completed manufacturing optimization trial for lightweight electric vehicle chassis';
      sectorCat = 'Production Line';
    }

    return [
      {
        title: `${sym} Announcement: ${sectorAction}`,
        date: 'June 22, 2026',
        category: sectorCat,
        daysAgo: '1 day ago'
      },
      {
        title: `Outcome of Board Meeting: Approval of Standalone Audited Financials for the Quarter and Year ended March 31, 2026`,
        date: 'May 28, 2026',
        category: 'Financials',
        daysAgo: '26 days ago'
      },
      {
        title: `Disclosure under Regulation 30 of SEBI LODR - Credit Rating Affirmation of Long-term Loans`,
        date: 'April 20, 2026',
        category: 'Credit Ratings',
        daysAgo: '64 days ago'
      },
      {
        title: `Intimation of schedule of Analyst Meet and Presentation on Growth Projections`,
        date: 'April 10, 2026',
        category: 'Investor Meet',
        daysAgo: '74 days ago'
      }
    ];
  }
};

export const getQuarterlyData = (symbol: string) => {
  const sym = symbol.toUpperCase().trim();
  const hash = sym.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Custom exact standalone financials for known tickers to look perfect
  let baseRevenue = 150;
  let oMargin = 0.15;

  if (sym === 'AVANTEL') {
    baseRevenue = 110;
    oMargin = 0.262;
  } else if (sym === 'COASTAL') {
    baseRevenue = 180;
    oMargin = 0.112;
  } else if (sym === 'FRONTIER') {
    baseRevenue = 65;
    oMargin = 0.18;
  } else if (sym === 'RELIANCE') {
    baseRevenue = 195000;
    oMargin = 0.184;
  } else if (sym === 'HDFCBANK') {
    baseRevenue = 48000;
    oMargin = 0.45; // High Net Interest Margin
  } else if (sym === 'INFY') {
    baseRevenue = 34000;
    oMargin = 0.24;
  } else if (sym === 'TATAMOTORS') {
    baseRevenue = 92000;
    oMargin = 0.141;
  } else if (sym === 'KPITTECH') {
    baseRevenue = 1100;
    oMargin = 0.20;
  } else {
    baseRevenue = (hash % 1000) + 120;
    oMargin = 0.10 + ((hash % 15) / 100);
  }

  const quarters = ['Jun 2025', 'Sep 2025', 'Dec 2025', 'Mar 2026'];
  return quarters.map((quarter, idx) => {
    const revMultiplier = 1 + (idx * 0.05) + ((hash % 5) * 0.01);
    const revenue = Math.round(baseRevenue * revMultiplier);
    const expenses = Math.round(revenue * (1 - oMargin));
    const opProfit = revenue - expenses;
    const opm = Number((((revenue - expenses) / revenue) * 100).toFixed(2));
    const netProfit = Math.round(opProfit * 0.72); // after tax

    return {
      quarter,
      revenue,
      expenses,
      opProfit,
      opm,
      netProfit
    };
  });
};

export const getHistoricalData = (symbol: string, basePrice: number) => {
  const sym = symbol.toUpperCase().trim();
  const hash = sym.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const data: { date: string; price: number; pctChange: number }[] = [];
  const today = new Date();
  
  // Create beautiful deterministic price progression
  let prices: number[] = [];
  let currentPrice = basePrice * 0.95; // begin slightly below

  const volatility = sym === 'AVANTEL' ? 0.024 : sym === 'RELIANCE' ? 0.012 : 0.016;
  const trendDrift = sym === 'AVANTEL' || sym === 'KPITTECH' || sym === 'TATAMOTORS' ? 0.0025 : 0.0008;

  for (let i = 0; i < 30; i++) {
    const sineWave = Math.sin((hash % 10) + i * 0.3);
    const cosWave = Math.cos((hash % 7) + i * 0.15);
    const randTerm = Math.sin(hash + i * 1.5) * 0.4;
    
    const change = (sineWave * 0.6 + cosWave * 0.3 + randTerm) * volatility + trendDrift;
    currentPrice = currentPrice * (1 + change);
    prices.push(currentPrice);
  }

  // Scale so that last price is EXACTLY basePrice
  const lastPrice = prices[prices.length - 1];
  const scaleFactor = basePrice / lastPrice;
  
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - (29 - i));
    const dateStr = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    
    const scaledPrice = Number((prices[i] * scaleFactor).toFixed(2));
    const prevPrice = i > 0 ? prices[i - 1] * scaleFactor : scaledPrice / (1 + ((Math.sin(hash) * 0.5) / 100));
    const pctChange = Number((((scaledPrice - prevPrice) / prevPrice) * 100).toFixed(2));

    data.push({
      date: dateStr,
      price: scaledPrice,
      pctChange
    });
  }
  
  return data;
};
