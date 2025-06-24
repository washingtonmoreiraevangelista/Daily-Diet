import React, { useState } from 'react'
import {
  Card, CardContent, CardHeader, TextField, Button, Typography, Box, Grid, Paper, Chip
} from '@mui/material'
import { Calculate, FitnessCenter, Height } from '@mui/icons-material'
import { IMCResult } from './imcResult'

export const IMCCalculator = () => {
  const [peso, setPeso] = useState('')
  const [altura, setAltura] = useState('')
  const [imc, setImc] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)

  const calcularIMC = () => {
    const pesoNum = parseFloat(peso)
    const alturaNum = parseFloat(altura)

    if (pesoNum > 0 && alturaNum > 0) {
      const alturaMetros = alturaNum > 3 ? alturaNum / 100 : alturaNum
      const imcCalculado = pesoNum / (alturaMetros * alturaMetros)
      setImc(imcCalculado)
      setShowResult(true)
    }
  }

  const limparFormulario = () => {
    setPeso('')
    setAltura('')
    setImc(null)
    setShowResult(false)
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card elevation={3}>
            <CardHeader title={<Box display="flex" alignItems="center" justifyContent="center" gap={1}><Calculate color="primary" /><Typography variant="h5" fontWeight="bold">Calcular IMC</Typography></Box>} />
            <CardContent>
              <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField label="Peso (kg)" type="number" placeholder="Ex: 70" value={peso} onChange={e => setPeso(e.target.value)} variant="outlined" fullWidth InputProps={{ startAdornment: <FitnessCenter sx={{ mr: 1, color: 'primary.main' }} /> }} inputProps={{ step: "0.1", min: "0" }} />
                <Box>
                  <TextField label="Altura (metros ou cm)" type="number" placeholder="Ex: 1.75 ou 175" value={altura} onChange={e => setAltura(e.target.value)} variant="outlined" fullWidth InputProps={{ startAdornment: <Height sx={{ mr: 1, color: 'primary.main' }} /> }} inputProps={{ step: "0.01", min: "0" }} />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Digite em metros (ex: 1.75) ou centímetros (ex: 175)
                  </Typography>
                </Box>
                <Box display="flex" gap={2} pt={2}>
                  <Button onClick={calcularIMC} variant="contained" size="large" fullWidth disabled={!peso || !altura} sx={{ py: 1.5, background: 'linear-gradient(45deg, #1976d2, #3f51b5)', '&:hover': { background: 'linear-gradient(45deg, #1565c0, #303f9f)' } }}>Calcular IMC</Button>
                  {showResult && <Button onClick={limparFormulario} variant="outlined" size="large" sx={{ py: 1.5, minWidth: 120 }}>Limpar</Button>}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          {showResult && imc ? <IMCResult imc={imc} /> : <Box sx={{ minHeight: 400, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.5)', border: '2px dashed #ccc' }} />}
        </Grid>
      </Grid>
      <Paper elevation={2} sx={{ mt: 4, p: 3 }}>
        <Typography variant="h6" textAlign="center" gutterBottom>Tabela de Classificação do IMC</Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {[
            { label: 'Abaixo do peso', color: 'info', faixa: 'Menor que 18,5', bgcolor: '#e3f2fd', border: '#bbdefb' },
            { label: 'Peso normal', color: 'success', faixa: '18,5 - 24,9', bgcolor: '#e8f5e8', border: '#c8e6c9' },
            { label: 'Sobrepeso', color: 'warning', faixa: '25,0 - 29,9', bgcolor: '#fff3e0', border: '#ffcc02' },
            { label: 'Obesidade', color: 'error', faixa: '30,0 ou mais', bgcolor: '#ffebee', border: '#ffcdd2' }
          ].map(({ label, color, faixa, bgcolor, border }) => (
            <Grid item xs={12} sm={6} md={3} key={label}>
              <Paper elevation={1} sx={{ p: 2, textAlign: 'center', bgcolor, border: `1px solid ${border}` }}>
                <Chip label={label} color={color as any} sx={{ mb: 1, fontWeight: 'bold' }} />
                <Typography variant="body2" color="text.secondary">{faixa}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  )
}