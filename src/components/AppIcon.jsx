import React from 'react';
import {
    Activity, AlertCircle, AlertTriangle, Apple, ArrowLeft, ArrowUpLeft, Bell, BellRing, Building,
    Calculator, Calendar, CalendarDays, Camera, Car, Check, CheckCircle, ChefHat, ChevronDown,
    ChevronLeft, ChevronRight, ChevronUp, Circle, Clock, Copy, CreditCard, Crown, DollarSign,
    Download, Edit, ExternalLink, Eye, EyeOff, Filter, Flame, Flower, Grid3X3, Group, Heart,
    HelpCircle, Home, Image, Info, LayoutDashboard, List, Lock, LogIn, LogOut, Mail, MapPin, Menu,
    MessageCircle, MessageSquare, Minus, MoreHorizontal, Music, Package, Palette, PartyPopper,
    Phone, Plus, QrCode, Receipt, RefreshCw, Search, Settings, Shield, ShoppingCart, Sparkles,
    Star, Store, Target, ThumbsUp, Trash2, TrendingDown, TrendingUp, Trophy, Truck, User,
    UserCheck, UserPlus, Users, Variable, Volume2, Wallet, X,
} from 'lucide-react';

// Icons are looked up by name, so only the ones listed here end up in the bundle.
// Importing all of lucide-react this way would ship every icon in the library.
const icons = {
    Activity, AlertCircle, AlertTriangle, Apple, ArrowLeft, ArrowUpLeft, Bell, BellRing, Building,
    Calculator, Calendar, CalendarDays, Camera, Car, Check, CheckCircle, ChefHat, ChevronDown,
    ChevronLeft, ChevronRight, ChevronUp, Circle, Clock, Copy, CreditCard, Crown, DollarSign,
    Download, Edit, ExternalLink, Eye, EyeOff, Filter, Flame, Flower, Grid3X3, Group, Heart,
    HelpCircle, Home, Image, Info, LayoutDashboard, List, Lock, LogIn, LogOut, Mail, MapPin, Menu,
    MessageCircle, MessageSquare, Minus, MoreHorizontal, Music, Package, Palette, PartyPopper,
    Phone, Plus, QrCode, Receipt, RefreshCw, Search, Settings, Shield, ShoppingCart, Sparkles,
    Star, Store, Target, ThumbsUp, Trash2, TrendingDown, TrendingUp, Trophy, Truck, User,
    UserCheck, UserPlus, Users, Variable, Volume2, Wallet, X,
};

function Icon({
    name,
    size = 24,
    color = "currentColor",
    className = "",
    strokeWidth = 2,
    ...props
}) {
    const IconComponent = icons?.[name];

    if (!IconComponent) {
        if (import.meta.env.DEV && name) {
            console.warn(`Icon "${name}" is not registered in AppIcon.jsx`);
        }
        return <HelpCircle size={size} color="gray" strokeWidth={strokeWidth} className={className} {...props} />;
    }

    return <IconComponent
        size={size}
        color={color}
        strokeWidth={strokeWidth}
        className={className}
        {...props}
    />;
}
export default Icon;
