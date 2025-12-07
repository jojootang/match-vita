// components/Navigation.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Home, 
  Pill, 
  Utensils, 
  Calendar, 
  User,
  Bell,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';

export default function Navigation() {
  const { user } = useAuth();
  const [showNotification, setShowNotification] = useState(false);

  const navItems = [
    { href: '/', icon: <Home className="h-5 w-5" />, label: 'หน้าแรก' },
    { href: '/dashboard', icon: <TrendingUp className="h-5 w-5" />, label: 'แดชบอร์ด' },
    { href: '/vitamins', icon: <Pill className="h-5 w-5" />, label: 'วิตามิน' },
    { href: '/food', icon: <Utensils className="h-5 w-5" />, label: 'อาหาร' },
    { href: '/plan', icon: <Calendar className="h-5 w-5" />, label: 'แผน' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg"></div>
            <span className="font-bold text-xl text-gray-800">MatchVita</span>
          </Link>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {item.icon}
                <span className="ml-2 font-medium">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            {/* Notification Bell with Counter */}
            <button 
              onClick={() => setShowNotification(!showNotification)}
              className="relative p-2 text-gray-600 hover:text-gray-800"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            {/* User Profile */}
            {user ? (
              <Link href="/profile" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-full"></div>
                <span className="hidden md:inline text-gray-700 font-medium">
                  {user.name}
                </span>
              </Link>
            ) : (
              <Link 
                href="/login" 
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-medium hover:opacity-90"
              >
                เข้าสู่ระบบ
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-gray-100">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center p-2 text-gray-600 hover:text-green-600"
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Notification Dropdown */}
      {showNotification && (
        <div className="absolute right-4 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-800">การแจ้งเตือน</h3>
            <button 
              onClick={() => setShowNotification(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium">เวลา 13:00 - ทานวิตามินซี</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">หลังอาหารกลางวัน</p>
            </div>
            
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium">ภารกิจประจำวัน: ดื่มน้ำ 8 แก้ว</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">คุณทำได้ 4/8 แล้ว!</p>
            </div>
            
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                <span className="text-sm font-medium">วิตามิน B-Complex กำลังลดราคา!</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">ลด 20% จนถึงพรุ่งนี้</p>
            </div>
          </div>
          
          <Link 
            href="/notifications" 
            className="block text-center mt-4 text-sm text-green-600 hover:text-green-800"
          >
            ดูการแจ้งเตือนทั้งหมด
          </Link>
        </div>
      )}
    </nav>
  );
}