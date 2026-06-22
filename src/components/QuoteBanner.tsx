import { StyleSheet, Text, View } from 'react-native';
import { Quote } from '../services/api';
import { colors } from '../theme/colors';

interface QuoteBannerProps {
  quote: Quote;
}

export function QuoteBanner({ quote }: QuoteBannerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Daily inspiration</Text>
      <Text style={styles.content}>"{quote.content}"</Text>
      <Text style={styles.author}>— {quote.author}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  content: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  author: {
    marginTop: 8,
    fontSize: 13,
    color: colors.textSecondary,
  },
});
