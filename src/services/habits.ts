import { supabase } from '../supabaseClient'; // Ajustá la ruta a tu cliente de Supabase

export interface Habit {
  id: string;
  name: string;
  icon: string;
  completed?: boolean;
}

// 1. Obtener hábitos del usuario con su estado de HOY
export const getTodayHabits = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const today = new Date().toISOString().split('T')[0];

  // Traer los hábitos del usuario
  const { data: habits, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    console.error('Error al traer hábitos:', error);
    return [];
  }

  // Traer los registros de hoy
  const { data: logs } = await supabase
    .from('habit_logs')
    .select('*')
    .eq('user_id', user.id)
    .eq('date', today);

  // Unir hábitos con su estado completado de hoy
  return habits.map(habit => {
    const log = logs?.find(l => l.habit_id === habit.id);
    return {
      ...habit,
      completed: log ? log.completed : false
    };
  });
};

// 2. Marcar / Desmarcar hábito hoy
export const toggleHabitLog = async (habitId: string, currentStatus: boolean) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const today = new Date().toISOString().split('T')[0];

  const { error } = await supabase
    .from('habit_logs')
    .upsert({
      habit_id: habitId,
      user_id: user.id,
      date: today,
      completed: !currentStatus
    }, { onConflict: 'habit_id, date' });

  if (error) console.error('Error al actualizar hábito:', error);
};
