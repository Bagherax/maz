import React, { useMemo } from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import { useMarketplace } from '../../context/MarketplaceContext';
import { UserTier } from '../../types';

const MetricCard: React.FC<{ title: string, value: string | number, subtext?: string }> = ({ title, value, subtext }) => (
    <div className="bg-white dark:bg-gray-700/50 p-4 rounded-lg shadow">
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h4>
        <p className="text-3xl font-bold text-gray-800 dark:text-gray-200 mt-1">{value}</p>
        {subtext && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtext}</p>}
    </div>
);

const ChartContainer: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white dark:bg-gray-700/50 p-4 rounded-lg shadow">
        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">{title}</h4>
        <div>{children}</div>
    </div>
);

// A simple bar chart component for demonstration
const BarChart: React.FC<{ data: { label: string, value: number }[], color: string }> = ({ data, color }) => {
    const maxValue = Math.max(...data.map(d => d.value), 1);
    return (
        <div className="space-y-2">
            {data.map(item => (
                <div key={item.label} className="flex items-center">
                    <span className="w-24 text-sm text-gray-600 dark:text-gray-300 truncate">{item.label}</span>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-4">
                        <div 
                            className={`${color} h-4 rounded-full text-white text-xs flex items-center justify-end pr-2`}
                            style={{ width: `${(item.value / maxValue) * 100}%` }}
                        >
                            {item.value.toLocaleString()}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};


const AnalyticsDashboard: React.FC = () => {
    const { t } = useLocalization();
    const { users, ads, adminConfig } = useMarketplace();

    const totalRevenue = useMemo(() => {
        return ads.reduce((total, ad) => {
            const commissionRate = adminConfig.commissionRates[ad.seller.tier] / 100;
            return total + (ad.price * commissionRate);
        }, 0);
    }, [ads, adminConfig.commissionRates]);
    
    // Mock User Growth Data
    const userGrowthData = [
        { label: 'This Month', value: users.filter(u => new Date(u.createdAt) > new Date(new Date().setDate(new Date().getDate() - 30))).length },
        { label: 'Last Month', value: 18 }, // Mock data
        { label: '3 Months Ago', value: 12 }, // Mock data
    ];

    // Estimated Revenue by Tier
    const revenueByTier = useMemo(() => {
        const tierRevenue: Record<UserTier['level'], number> = { normal: 0, bronze: 0, silver: 0, gold: 0, platinum: 0, diamond: 0, su_diamond: 0, MAZ: 0 };
        ads.forEach(ad => {
             const commission = ad.price * (adminConfig.commissionRates[ad.seller.tier] / 100);
             tierRevenue[ad.seller.tier] += commission;
        });
        return Object.entries(tierRevenue).map(([label, value]) => ({ label: label as string, value }));
    }, [ads, adminConfig.commissionRates]);

    // Ads by Category
    const adsByCategory = useMemo(() => {
        const counts = ads.reduce((acc, ad) => {
            acc[ad.category] = (acc[ad.category] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        return Object.entries(counts).map(([label, value]) => ({ label, value }));
    }, [ads]);
    
    // Users by Country
    const usersByCountry = useMemo(() => {
        const counts = ads.reduce((acc, ad) => {
            const country = ad.location.country;
            acc[country] = (acc[country] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        return Object.entries(counts).map(([label, value]) => ({ label, value }));
    }, [ads]);

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{"Analytics"}</h3>
            
            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <MetricCard title={"Total Users"} value={users.length} />
                <MetricCard title={"Total Active Ads"} value={ads.filter(a => a.status === 'active').length} />
                <MetricCard title={"Est. Total Revenue"} value={totalRevenue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartContainer title={"User Growth"}>
                    <BarChart data={userGrowthData} color="bg-blue-500" />
                </ChartContainer>
                <ChartContainer title={"Estimated Revenue by Tier"}>
                    <BarChart data={revenueByTier} color="bg-green-500" />
                </ChartContainer>
                <ChartContainer title={"Content Performance (Ads by Category)"}>
                    <BarChart data={adsByCategory} color="bg-purple-500" />
                </ChartContainer>
                 <ChartContainer title={"Geographic Distribution (Ads by Country)"}>
                    <BarChart data={usersByCountry} color="bg-yellow-500" />
                </ChartContainer>
            </div>
             <ChartContainer title={"System Health Monitoring"}>
                <div className="flex space-x-8">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-green-500">120ms</p>
                        <p className="text-sm text-gray-500">Avg. API Response</p>
                    </div>
                     <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-500">35%</p>
                        <p className="text-sm text-gray-500">Server Load</p>
                    </div>
                </div>
            </ChartContainer>
        </div>
    );
};

export default AnalyticsDashboard;