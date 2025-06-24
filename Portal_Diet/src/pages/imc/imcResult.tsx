import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Chip,
  Paper,
  LinearProgress
} from '@mui/material'
import {
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Warning
} from '@mui/icons-material'

interface IMCResultProps {
  imc: number
}

 export const IMCResult = ({ imc }: IMCResultProps) => {
  const getClassificacao = (imc: number) => {
    if (imc < 18.5) {
      return {
        categoria: 'Abaixo do peso',
        cor: 'info',
        bgcolor: '#e3f2fd',
        icon: <TrendingDown />,
        descricao: 'Pode ser necessário ganhar peso de forma saudável',
        recomendacao: 'Consulte um nutricionista para um plano alimentar adequado'
      }
    } else if (imc >= 18.5 && imc < 25) {
      return {
        categoria: 'Peso normal',
        cor: 'success',
        bgcolor: '#e8f5e8',
        icon: <CheckCircle />,
        descricao: 'Seu peso está dentro da faixa ideal',
        recomendacao: 'Mantenha uma alimentação equilibrada e pratique exercícios'
      }
    } else if (imc >= 25 && imc < 30) {
      return {
        categoria: 'Sobrepeso',
        cor: 'warning',
        bgcolor: '#fff3e0',
        icon: <TrendingUp />,
        descricao: 'Ligeiramente acima do peso ideal',
        recomendacao: 'Considere ajustar a dieta e aumentar a atividade física'
      }
    } else {
      return {
        categoria: 'Obesidade',
        cor: 'error',
        bgcolor: '#ffebee',
        icon: <Warning />,
        descricao: 'Acima do peso recomendado',
        recomendacao: 'Procure orientação médica e nutricional'
      }
    }
  }

  const classificacao = getClassificacao(imc)

  return (
    <Card elevation={3} sx={{ bgcolor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', animation: 'slideIn 0.5s ease-out', '@keyframes slideIn': { from: { transform: 'translateX(20px)', opacity: 0 }, to: { transform: 'translateX(0)', opacity: 1 } } }}>
      <CardHeader
        title={<Typography variant="h5" textAlign="center" fontWeight="bold">Seu Resultado</Typography>}
      />
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box textAlign="center">
          <Typography variant="h2" fontWeight="bold">{imc.toFixed(1)}</Typography>
          <Typography variant="h6" color="text.secondary">Seu IMC</Typography>
        </Box>

        <Box display="flex" justifyContent="center">
          <Chip icon={classificacao.icon} label={classificacao.categoria} color={classificacao.cor as any} sx={{ py: 2, px: 1, fontSize: '1.1rem', fontWeight: 'bold', '& .MuiChip-icon': { fontSize: '1.2rem' } }} />
        </Box>

        <Box textAlign="center" sx={{ gap: 2, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="body1" fontWeight="medium">{classificacao.descricao}</Typography>
          <Paper elevation={1} sx={{ p: 2, bgcolor: 'grey.50', borderLeft: '4px solid', borderLeftColor: `${classificacao.cor}.main` }}>
            <Typography variant="body2" color="text.secondary">💡 {classificacao.recomendacao}</Typography>
          </Paper>
        </Box>

        <Box sx={{ gap: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="body2" color="text.secondary" textAlign="center">Posição na escala</Typography>
          <Box sx={{ position: 'relative' }}>
            <LinearProgress variant="determinate" value={100} sx={{ height: 16, borderRadius: 8, bgcolor: 'grey.200', '& .MuiLinearProgress-bar': { background: 'linear-gradient(to right, #2196f3, #4caf50, #ff9800, #f44336)', borderRadius: 8 } }} />
            <Box sx={{ position: 'absolute', top: 2, left: `${Math.min(Math.max((imc - 15) / 25 * 100, 0), 100)}%`, width: 12, height: 12, bgcolor: 'grey.800', borderRadius: '50%', transform: 'translateX(-50%)', border: '2px solid white', boxShadow: 1 }} />
          </Box>
          <Box display="flex" justifyContent="space-between">
            {['15', '20', '25', '30', '35+'].map(value => (
              <Typography key={value} variant="caption" color="text.secondary">{value}</Typography>
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}