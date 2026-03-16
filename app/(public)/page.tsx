import type { Metadata } from 'next'
import HeroSection from '@/components/home/HeroSection'
import CategoryGrid from '@/components/home/CategoryGrid'
import ValueProposition from '@/components/home/ValueProposition'
import CtaBanner from '@/components/home/CtaBanner'
import MaderasSection from '@/components/home/MaderasSection'
import { createClient } from '@/lib/supabase/server'
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants'

export const metadata: Metadata = {
  title: { absolute: 'Muebles Rústicos Solymar | Uruguay' },
  description: SITE_DESCRIPTION,
}

export const revalidate = 3600 // ISR: re-generate every hour

export default async function HomePage() {
  const supabase = await createClient()

  const { data: categories } = await supabase.from('categories').select('*').order('name')

  return (
    <>
      <HeroSection />
      <CategoryGrid dbCategories={categories ?? []} />
      <MaderasSection />
      <ValueProposition />
      <CtaBanner />
    </>
  )
}
