// scripts/reclassement-ultimate.js
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ============================================
// 📋 DICTIONNAIRE DES CATÉGORIES (basé sur les PRODUITS)
// ============================================
const PRODUCT_CATEGORIES = {
  // AGROALIMENTAIRE
  'AGROALIMENTAIRE': {
    keywords: [
      'lait', 'fromage', 'yaourt', 'beurre', 'crème', 'dessert',
      'huile', 'olive', 'margarine', 'smen',