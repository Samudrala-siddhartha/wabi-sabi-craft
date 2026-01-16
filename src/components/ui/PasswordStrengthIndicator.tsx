import React, { useMemo } from 'react';
import { Progress } from './progress';
import { Check, X } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const strength = useMemo(() => {
    let score = 0;
    const checks = {
      minLength: password.length >= 6,
      goodLength: password.length >= 8,
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    if (checks.minLength) score++;
    if (checks.goodLength) score++;
    if (checks.hasLowercase) score++;
    if (checks.hasUppercase) score++;
    if (checks.hasNumber) score++;
    if (checks.hasSpecial) score++;

    return { score, checks };
  }, [password]);

  const getStrengthLabel = () => {
    if (strength.score <= 1) return 'Weak';
    if (strength.score <= 3) return 'Fair';
    if (strength.score <= 5) return 'Good';
    return 'Strong';
  };

  const getStrengthColor = () => {
    if (strength.score <= 1) return 'bg-red-500';
    if (strength.score <= 3) return 'bg-orange-500';
    if (strength.score <= 5) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getTextColor = () => {
    if (strength.score <= 1) return 'text-red-500';
    if (strength.score <= 3) return 'text-orange-500';
    if (strength.score <= 5) return 'text-yellow-500';
    return 'text-green-500';
  };

  if (!password) return null;

  const progressValue = (strength.score / 6) * 100;

  return (
    <div className="space-y-2 mt-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${getStrengthColor()}`}
            style={{ width: `${progressValue}%` }}
          />
        </div>
        <span className={`text-xs font-medium ${getTextColor()}`}>
          {getStrengthLabel()}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-1 text-xs">
        <div className="flex items-center gap-1">
          {strength.checks.minLength ? (
            <Check className="w-3 h-3 text-green-500" />
          ) : (
            <X className="w-3 h-3 text-muted-foreground" />
          )}
          <span className={strength.checks.minLength ? 'text-green-500' : 'text-muted-foreground'}>
            6+ characters
          </span>
        </div>
        <div className="flex items-center gap-1">
          {strength.checks.hasUppercase ? (
            <Check className="w-3 h-3 text-green-500" />
          ) : (
            <X className="w-3 h-3 text-muted-foreground" />
          )}
          <span className={strength.checks.hasUppercase ? 'text-green-500' : 'text-muted-foreground'}>
            Uppercase letter
          </span>
        </div>
        <div className="flex items-center gap-1">
          {strength.checks.hasLowercase ? (
            <Check className="w-3 h-3 text-green-500" />
          ) : (
            <X className="w-3 h-3 text-muted-foreground" />
          )}
          <span className={strength.checks.hasLowercase ? 'text-green-500' : 'text-muted-foreground'}>
            Lowercase letter
          </span>
        </div>
        <div className="flex items-center gap-1">
          {strength.checks.hasNumber ? (
            <Check className="w-3 h-3 text-green-500" />
          ) : (
            <X className="w-3 h-3 text-muted-foreground" />
          )}
          <span className={strength.checks.hasNumber ? 'text-green-500' : 'text-muted-foreground'}>
            Number
          </span>
        </div>
        <div className="flex items-center gap-1">
          {strength.checks.hasSpecial ? (
            <Check className="w-3 h-3 text-green-500" />
          ) : (
            <X className="w-3 h-3 text-muted-foreground" />
          )}
          <span className={strength.checks.hasSpecial ? 'text-green-500' : 'text-muted-foreground'}>
            Special character
          </span>
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
