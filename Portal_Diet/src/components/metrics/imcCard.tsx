import { useState } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
} from '@mui/material'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'

function calcularIMC(peso: number, altura: number) {
  if (!peso || !altura) {
    return { imc: 0, categoria: 'Preencha os campos', pesoIdeal: 0, acimaPesoPercentual: 0 }
  }

  const imc = peso / (altura * altura)
  let categoria = ''

  if (imc < 18.5) categoria = 'Magreza'
  else if (imc < 25) categoria = 'Normal'
  else if (imc < 30) categoria = 'Sobrepeso'
  else if (imc < 35) categoria = 'Obesidade Grau I'
  else if (imc < 40) categoria = 'Obesidade Grau II'
  else categoria = 'Obesidade Grau III'

  const pesoIdeal = 24.9 * altura * altura
  const acimaPesoPercentual = imc > 24.9 ? Math.round(((peso - pesoIdeal) / pesoIdeal) * 100) : 0

  return {
    imc: parseFloat(imc.toFixed(1)),
    categoria,
    pesoIdeal: parseFloat(pesoIdeal.toFixed(1)),
    acimaPesoPercentual,
  }
}

export const ImcCard = () => {
  const [peso, setPeso] = useState('')
  const [altura, setAltura] = useState('')

  const pesoNum = parseFloat(peso)
  const alturaNum = parseFloat(altura)

  const { imc, categoria, pesoIdeal, acimaPesoPercentual } = calcularIMC(pesoNum, alturaNum)

  return (
    <Card
      sx={{
      background:'#a10ee6',
      color: "#fff",
      boxShadow: 6,
      transition: "0.3s",
      "&:hover": {
        boxShadow: 10,
      },
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <FitnessCenterIcon sx={{ fontSize: 60 }} />
              <Typography variant="subtitle2">IMC</Typography>
            </Box>
            <Typography variant="h5" fontWeight="bold">
              {categoria}
            </Typography>
            {pesoIdeal > 0 && (
              <Typography variant="body2">
                Peso ideal: {pesoIdeal} kg
              </Typography>
            )}
            {acimaPesoPercentual > 0 && (
              <Typography variant="body2">
                Acima do ideal: {acimaPesoPercentual}%
              </Typography>
            )}
            {imc && acimaPesoPercentual === 0 && imc < 25 && (
              <Typography variant="body2">Peso ideal atingido</Typography>
            )}
          </Box>

          <Box display="flex" flexDirection="column" gap={1} ml={2}>
            <TextField
              label="Peso (kg)"
              type="number"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
              size="small"
              variant="outlined"
              InputProps={{
                sx: {
                  backgroundColor: '#fff',
                  borderRadius: 1,
                  fontSize: '0.75rem', // texto menor
                  height: 36,           // altura menor
                },
              }}
              InputLabelProps={{
                sx: {
                  fontSize: '0.75rem', // label menor
                },
              }}
              sx={{ width: 100 }}
            />
            <TextField
              label="Altura (m)"
              type="number"
              value={altura}
              onChange={(e) => setAltura(e.target.value)}
              size="small"
              variant="outlined"
              InputProps={{
                sx: {
                  backgroundColor: '#fff',
                  borderRadius: 1,
                  fontSize: '0.75rem',
                  height: 36,
                },
              }}
              InputLabelProps={{
                sx: {
                  fontSize: '0.75rem',
                },
              }}
              sx={{ width: 100 }}
            />
          </Box>

        </Box>
      </CardContent>
    </Card>
  )
}
